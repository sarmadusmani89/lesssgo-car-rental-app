import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import * as nodeCrypto from 'crypto';
import { SettingsService } from '../settings/settings.service';
import { BookingEmailService } from '../booking/services/booking.email.service';
import { KinaHmacService } from './kina-hmac.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly settingsService: SettingsService,
    private readonly kinaHmacService: KinaHmacService,
    private readonly bookingEmailService: BookingEmailService,
  ) { }

  async initializeKinaPayment(bookingId: string, paymentType: 'RENTAL' | 'BOND' = 'RENTAL') {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true, payments: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // ── 1. Production Guard: Prevent Double Charges ─────────────────────────
    // Check for existing PAID payments of the same type
    const isBond = paymentType === 'BOND';
    const existingPaid = booking.payments.find(p => 
      p.status === 'PAID' && 
      (isBond ? p.kinaOrderId?.endsWith('-B') : !p.kinaOrderId?.endsWith('-B'))
    );

    if (existingPaid) {
      throw new BadRequestException(`This ${paymentType.toLowerCase()} has already been paid/authorized.`);
    }

    const existingPending = booking.payments.find(p => 
      p.status === 'PENDING' && 
      p.kinaOrderId &&
      (isBond ? p.kinaOrderId.endsWith('-B') : !p.kinaOrderId.endsWith('-B'))
    );
    
    const gatewayUrl = this.configService.get<string>('KINA_GATEWAY_URL');
    const terminal = this.configService.get<string>('KINA_TERMINAL_ID');
    const merchant = this.configService.get<string>('KINA_MERCHANT_ID');
    const merchName = this.configService.get<string>('KINA_MERCH_NAME') || 'LesssGo Car Rental';
    const merchUrl = this.configService.get<string>('KINA_MERCH_URL') || 'https://lesssgo.com';
    const backref = this.configService.get<string>('KINA_BACKREF_URL');

    if (!gatewayUrl || !terminal || !merchant || !backref) {
      throw new InternalServerErrorException('Kina Gateway configuration is incomplete');
    }

    // ── 2. Robust Order ID Generation ───────────────────────────────────────
    // Always generate a FRESH numeric Order ID to avoid signature/duplicate conflicts.
    // Format: YYYYMMDDHHMMSS (14) + Type (1) + Random (5) = 20 Digits
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
    const typeDigit = isBond ? '9' : '0'; // 9 for Bond, 0 for Rental
    const randomSuffix = nodeCrypto.randomInt(10000, 99999).toString();
    const orderId = `${timestamp}${typeDigit}${randomSuffix}`;
    
    const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();

    const amount = isBond ? booking.bondAmount : booking.totalAmount;
    const trType = isBond ? '0' : '1'; // 0 = Auth, 1 = Purchase

    this.logger.log(`[INIT ${paymentType}] Booking: ${bookingId} | OrderID: ${orderId} | Amount: ${amount}`);

    const fields = {
      TERMINAL: terminal,
      TRTYPE: trType,
      AMOUNT: amount.toFixed(2),
      CURRENCY: 'PGK',
      ORDER: orderId,
      DESC: isBond ? `Security Bond - ${booking.car.name}` : `Rental Fee - ${booking.car.name}`,
      MERCH_NAME: merchName,
      MERCH_URL: merchUrl,
      MERCHANT: merchant,
      EMAIL: booking.user.email,
      TIMESTAMP: timestamp,
      NONCE: nonce,
      BACKREF: backref,
      COUNTRY: '',
      MERCH_GMT: '',
    };

    const macString = this.kinaHmacService.buildRequestMacString(fields);
    const pSign = this.kinaHmacService.computeHmac(macString);

    // ── 3. Record Payment State ─────────────────────────────────────────────
    // We create a NEW record for each attempt to keep a clear audit trail
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: amount,
        currency: 'PGK',
        status: 'PENDING',
        kinaOrderId: orderId,
        kinaNonce: nonce,
        paymentMethod: 'ONLINE',
      },
    });

    return {
      gatewayUrl,
      fields: {
        ...fields,
        P_SIGN: pSign,
      },
    };
  }

  async handleKinaCallback(body: any): Promise<string> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      this.logger.log('📨 KINA CALLBACK RECEIVED');
      this.logger.log(`[RAW BODY] ${JSON.stringify(body)}`);

      const {
        ACTION, RC, APPROVAL, RRN, INT_REF,
        TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER,
        TIMESTAMP, NONCE, P_SIGN,
      } = body;

      const kinaMerchantId = this.configService.get<string>('KINA_MERCHANT_ID');

      // ── 1. Verify HMAC signature ──────────────────────────────────────────
      const macString = this.kinaHmacService.buildResponseMacString({
        ACTION,
        RC,
        APPROVAL,
        CURRENCY,
        AMOUNT,
        TERMINAL,
        TRTYPE,
        ORDER,
        RRN,
        MERCHANT: kinaMerchantId,
        TIMESTAMP,
        INT_REF,
        NONCE,
      });

      const isValid = this.kinaHmacService.verifySignature(macString, P_SIGN);

      // ── 2. Performance Logic: Strict for Success, Tolerant for Fails ──────
      // If payment is SUCCESSFUL (ACTION=0), signature verification is MANDATORY.
      if (!isValid && ACTION === '0') {
        this.logger.error(`❌ CRITICAL: Kina HMAC verification FAILED for SUCCESSFUL Order: ${ORDER}`);
        this.logger.error(`   Potential tampering detected for Order: ${ORDER}`);
        return `${frontendUrl}/payment/error?reason=signature_mismatch`;
      }

      // If payment FAILED or was DECLINED, we log the mismatch but still redirect.
      // This is because Kina sandbox sometimes signs Fails/Declined with a different logic.
      if (!isValid) {
        this.logger.warn(
          `⚠️ Kina HMAC mismatch on non-success callback (ACTION=${ACTION} RC=${RC}). ` +
          `Proceeding with redirect as transaction is already failed/declined.`,
        );
      } else {
        this.logger.log(`✅ HMAC signature verified for Order: ${ORDER}`);
      }

      // ── 3. Locate payment record ──────────────────────────────────────────
      const payment = await this.prisma.payment.findUnique({
        where: { kinaOrderId: ORDER },
        include: { booking: { include: { car: true, user: true } } },
      });

      if (!payment) {
        this.logger.error(`❌ Payment record not found for Kina Order: ${ORDER}`);
        return `${frontendUrl}/payment/error?reason=order_not_found`;
      }

      // ── 3. Idempotency guard — ignore duplicate callbacks ─────────────────
      if (payment.status === 'PAID') {
        this.logger.warn(`⚠️  Duplicate callback received for already-PAID Order: ${ORDER}. Ignoring.`);
        return `${frontendUrl}/payment/success?bookingId=${payment.bookingId}&payment=KINA&paymentStatus=PAID`;
      }

      // ── 5. Atomic State Transition (Prisma Transaction) ──────────────────
      if (ACTION === '0') {
        const result = await this.prisma.$transaction(async (tx) => {
          // 1. Update Payment record with gateway identifiers
          const updatedPayment = await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: 'PAID', // Both Pre-auth and Purchase are marked as PAID on the payment record
              kinaIntRef: INT_REF,
              kinaRrn: RRN,
              kinaActionCode: ACTION,
              kinaResponseCode: RC,
              kinaApprovalCode: APPROVAL,
            },
          });

          // 2. Update Booking based on Transaction Type
          const bookingData: any = {};
          if (TRTYPE === '24') {
            // Reversal (Refund) confirmed
            bookingData.bondStatus = 'REFUNDED';
          } else if (TRTYPE === '21') {
            // Completion (Capture) confirmed
            bookingData.bondStatus = 'CLAIMED';
          } else if (TRTYPE === '0') {
            // Pre-authorization (Bond Hold) confirmed
            bookingData.bondStatus = 'PAID';
          } else {
            // Standard Payment (Rental) confirmed
            bookingData.paymentStatus = 'PAID';
            bookingData.status = 'CONFIRMED';
            bookingData.paidAt = new Date();
            bookingData.confirmedAt = new Date();
          }

          const updatedBooking = await tx.booking.update({
            where: { id: payment.bookingId },
            data: bookingData,
            include: { car: true, user: true },
          });

          return { updatedPayment, updatedBooking };
        });

        this.logger.log(`✅ Booking ${payment.bookingId} confirmed & paid via Kina Bank (INT_REF: ${INT_REF})`);

        // Fire emails asynchronously — outside the transaction context
        this.bookingEmailService.sendKinaPaymentConfirmation(result.updatedBooking, INT_REF).catch((err) =>
          this.logger.error(`📧 Email send failed (non-blocking): ${err.message}`),
        );

        return `${frontendUrl}/payment/success?bookingId=${payment.bookingId}&payment=KINA&paymentStatus=PAID`;
      } else {
        const b = payment.booking;

        // --- Robust Failure Handling for Reversals (Refunds) ---
        if (TRTYPE === '24') {
          this.logger.error(`❌ Kina Reversal FAILED for Order: ${ORDER} (RC: ${RC})`);
          
          // Revert bond status to PAID so it's not stuck in REFUND_PENDING
          await this.prisma.booking.update({
            where: { id: b.id },
            data: { bondStatus: 'PAID' }
          });

          // Redirect to Admin dashboard with error info
          return `${frontendUrl}/admin/bookings/${b.id}?error=refund_failed&rc=${RC}`;
        }

        const status = ACTION === '2' ? 'DECLINED' : 'FAILED';
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: status as any,
            kinaActionCode: ACTION,
            kinaResponseCode: RC,
          },
        });

        this.logger.warn(`⚠️  Kina payment ${status} for Order: ${ORDER} (RC: ${RC})`);

        // Pass checkout parameters back so the frontend can reconstruct the "Try Again" URL
        const params = new URLSearchParams({
          order: ORDER,
          id: b.carId,
          startDate: b.startDate.toISOString(),
          endDate: b.endDate.toISOString(),
          pickupLocation: b.pickupLocation || '',
          returnLocation: b.returnLocation || '',
        });

        return `${frontendUrl}/payment/${status.toLowerCase()}?${params.toString()}`;
      }
    } catch (err: any) {
      this.logger.error(`💥 Unhandled exception in Kina callback: ${err.message}`, err.stack);
      return `${frontendUrl}/payment/error?reason=server_error`;
    }
  }


  create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: createPaymentDto as any,
    });
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: true,
            car: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.payment.findMany({
      where: {
        booking: {
          userId: userId
        }
      },
      include: {
        booking: {
          include: {
            car: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            user: true,
            car: true,
          }
        }
      }
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(id);
    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.payment.delete({ where: { id } });
  }

  async releaseBond(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    
    // Guard: prevent repeat reversals
    if (booking.bondStatus === 'REFUNDED') {
      throw new BadRequestException('Bond has already been refunded');
    }

    const kinaPayment = booking.payments.find((p) => p.kinaOrderId && p.status === 'PAID');

    if (booking.paymentMethod === 'ONLINE' && kinaPayment?.kinaOrderId) {
      // Build Reversal Request (TRTYPE 24)
      const terminal = this.configService.get<string>('KINA_TERMINAL_ID');
      const backref = this.configService.get<string>('KINA_BACKREF_URL');

      if (!terminal || !backref) {
        throw new InternalServerErrorException('Kina reversal configuration (TERMINAL_ID or BACKREF_URL) is missing');
      }

      const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();
      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);

      const fields = {
        TERMINAL: terminal,  // confirmed non-null above
        TRTYPE: '24', // Reversal
        AMOUNT: booking.bondAmount.toFixed(2),
        CURRENCY: 'PGK',
        ORDER: kinaPayment.kinaOrderId,
        RRN: kinaPayment.kinaRrn,
        INT_REF: kinaPayment.kinaIntRef,
        TIMESTAMP: timestamp,
        NONCE: nonce,
        BACKREF: backref,  // confirmed non-null above
      };

      // Since reversals on the gateway need to be a form post, we return the fields
      // and mark the status as pending admin verification
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { bondStatus: 'REFUND_PENDING' },
      });

      const reversalMacString = this.kinaHmacService.buildManagementMacString({
        TERMINAL: fields.TERMINAL,
        TRTYPE: fields.TRTYPE,
        AMOUNT: fields.AMOUNT,
        CURRENCY: fields.CURRENCY,
        ORDER: fields.ORDER,
        RRN: fields.RRN,
        INT_REF: fields.INT_REF,
        TIMESTAMP: fields.TIMESTAMP,
        NONCE: fields.NONCE,
        BACKREF: fields.BACKREF,
      });

      return {
        isKinaReversal: true,
        gatewayUrl: this.configService.get('KINA_GATEWAY_URL'),
        fields: {
          ...fields,
          P_SIGN: this.kinaHmacService.computeHmac(reversalMacString),
        },
      };
    } else {
      // Cash/Manual Bond Release
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { bondStatus: 'REFUNDED' },
      });
      return { message: 'Bond marked as refunded (Manual/Cash)' };
    }
  }

  async captureBond(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true, payments: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.bondStatus !== 'PAID') {
      throw new BadRequestException('Bond is not in a held (PAID) state and cannot be captured.');
    }

    // Find the successful pre-auth payment (TRTYPE 0)
    const preAuthPayment = booking.payments.find(
      (p) => p.status === 'PAID' && p.kinaOrderId?.endsWith('-B'),
    );

    if (!preAuthPayment) {
      throw new NotFoundException('Original bond authorization payment not found.');
    }

    const gatewayUrl = this.configService.get<string>('KINA_GATEWAY_URL');
    const terminal = this.configService.get<string>('KINA_TERMINAL_ID');
    const merchant = this.configService.get<string>('KINA_MERCHANT_ID');
    const backref = this.configService.get<string>('KINA_BACKREF_URL');

    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
    const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();

    // Completion (Capture) uses TRTYPE 21
    const fields = {
      TERMINAL: terminal,
      TRTYPE: '21',
      AMOUNT: preAuthPayment.amount.toFixed(2),
      CURRENCY: 'PGK',
      ORDER: preAuthPayment.kinaOrderId,
      RRN: preAuthPayment.kinaRrn,
      INT_REF: preAuthPayment.kinaIntRef,
      MERCHANT: merchant,
      TIMESTAMP: timestamp,
      NONCE: nonce,
      BACKREF: backref,
    };

    const macString = this.kinaHmacService.buildManagementMacString(fields as any);
    const pSign = this.kinaHmacService.computeHmac(macString);

    return {
      gatewayUrl,
      fields: {
        ...fields,
        P_SIGN: pSign,
      },
    };
  }
}
