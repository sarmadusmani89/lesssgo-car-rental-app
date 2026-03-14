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

  async initializeKinaPayment(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const gatewayUrl = this.configService.get<string>('KINA_GATEWAY_URL');
    const terminal = this.configService.get<string>('KINA_TERMINAL_ID');
    const merchant = this.configService.get<string>('KINA_MERCHANT_ID');
    const merchName = this.configService.get<string>('KINA_MERCH_NAME') || 'LesssGo Car Rental';
    const merchUrl = this.configService.get<string>('KINA_MERCH_URL') || 'https://lesssgo.com';
    const backref = this.configService.get<string>('KINA_BACKREF_URL');

    if (!gatewayUrl || !terminal || !merchant || !backref) {
      throw new InternalServerErrorException('Kina Gateway configuration is incomplete');
    }

    // Kina Bank strictly requires numeric Order ID (6-20 digits)
    const orderId = `${booking.id.replace(/\D/g, '').substring(0, 10)}${Math.floor(Date.now() / 1000)}`.substring(0, 20);
    const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14); // YYYYMMDDHHMMSS

    const fields = {
      TERMINAL: terminal,
      TRTYPE: '1', // 1 for Sales (Retail Financial Request)
      AMOUNT: (booking.totalAmount + booking.bondAmount).toFixed(2),
      CURRENCY: 'PGK',
      ORDER: orderId,
      DESC: `Car Rental - ${booking.car.name}`,
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

    // Create or update payment record
    await this.prisma.payment.upsert({
      where: { kinaOrderId: orderId },
      update: {
        status: 'PENDING',
        amount: booking.totalAmount + booking.bondAmount,
        kinaNonce: nonce,
      },
      create: {
        bookingId: booking.id,
        amount: booking.totalAmount + booking.bondAmount,
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
        ACTION, RC, APPROVAL, STAN, RRN, INT_REF,
        TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER,
        TIMESTAMP, NONCE, P_SIGN,
      } = body;

      // ── 1. Verify HMAC signature ──────────────────────────────────────────
      const macString = this.kinaHmacService.buildResponseMacString({
        ACTION, RC, APPROVAL, STAN, RRN, INT_REF,
        TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER,
        TIMESTAMP, NONCE,
      });

      const isValid = this.kinaHmacService.verifySignature(macString, P_SIGN);
      if (!isValid) {
        this.logger.error(`❌ Kina HMAC verification FAILED for Order: ${ORDER}`);
        this.logger.error(`   Raw body fields: ACTION=${ACTION} RC=${RC} APPROVAL=${APPROVAL} STAN=${STAN} ORDER=${ORDER}`);
        return `${frontendUrl}/payment/error?reason=signature_mismatch`;
      }

      this.logger.log(`✅ HMAC signature verified for Order: ${ORDER}`);

      // ── 2. Locate payment record ──────────────────────────────────────────
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
        return `${frontendUrl}/thank-you?bookingId=${payment.bookingId}&payment=KINA&paymentStatus=PAID`;
      }

      // ── 4. Process result ─────────────────────────────────────────────────
      // ACTION: 0=Success, 1=Duplicate, 2=Declined, 3=Other Error
      if (ACTION === '0') {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            kinaIntRef: INT_REF,
            kinaRrn: RRN,
            kinaActionCode: ACTION,
            kinaResponseCode: RC,
            kinaApprovalCode: APPROVAL,
          },
        });

        const updatedBooking = await this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            bondStatus: 'PAID',
            paidAt: new Date(),
            confirmedAt: new Date(),
          },
          include: { car: true, user: true },
        });

        this.logger.log(`✅ Booking ${payment.bookingId} confirmed & paid via Kina Bank (INT_REF: ${INT_REF})`);

        // Fire emails asynchronously — don't let email failure block the redirect
        this.bookingEmailService.sendKinaPaymentConfirmation(updatedBooking, INT_REF).catch((err) =>
          this.logger.error(`📧 Email send failed (non-blocking): ${err.message}`),
        );

        return `${frontendUrl}/thank-you?bookingId=${payment.bookingId}&payment=KINA&paymentStatus=PAID`;
      } else {
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
        return `${frontendUrl}/payment/${status.toLowerCase()}?order=${ORDER}`;
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

      const reversalMacString = this.kinaHmacService.buildReversalMacString({
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
}
