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

  async initializeKinaPayment(bookingId: string, paymentType: 'RENTAL' | 'BOND' | 'FULL' = 'RENTAL') {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true, payments: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // ── 1. Production Guard: Prevent Double Charges ─────────────────────────
    // Check for existing PAID payments of the same type
    const isBond = paymentType === 'BOND';
    const isFull = paymentType === 'FULL';

    const existingPaid = booking.payments.find(p => {
      if (p.status !== 'PAID' || !p.kinaOrderId) return false;
      const typeDigit = p.kinaOrderId.charAt(14);
      if (isBond) return typeDigit === '9' || typeDigit === '1'; // Bond (9) or Full (1) covers bond
      if (isFull) return typeDigit === '1';
      return typeDigit === '1' || typeDigit === '0'; // Full (1) or Rental (0) covers rental
    });

    if (existingPaid) {
      throw new BadRequestException(`This ${paymentType.toLowerCase()} payment has already been processed.`);
    }

    const existingPending = booking.payments.find(p => {
      if (p.status !== 'PENDING' || !p.kinaOrderId) return false;
      const typeDigit = p.kinaOrderId.charAt(14);
      if (isBond) return typeDigit === '9';
      if (isFull) return typeDigit === '1';
      return typeDigit === '0';
    });

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
    // 0 = Rental, 9 = Bond, 1 = Full
    const typeDigit = isFull ? '1' : (isBond ? '9' : '0');
    const randomSuffix = nodeCrypto.randomInt(10000, 99999).toString();
    const orderId = `${timestamp}${typeDigit}${randomSuffix}`;

    const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();

    // FULL flow authorizes BOTH amounts at once
    const amount = isFull ? (booking.totalAmount + booking.bondAmount) : (isBond ? booking.bondAmount : booking.totalAmount);

    // ── 3. TRTYPE Logic (Purchase-Reversal Flow) ──────────────────────────
    // Per user request, we use TRTYPE 1 (Purchase) for both Test and Production.
    // This ensures immediate fund collection for the total amount (Rental + Bond).
    const trType = '1';

    if (this.configService.get<string>('KINA_TEST_MODE') === 'true') {
      this.logger.warn(`🧪 KINA_TEST_MODE is ENABLED`);
    }

    this.logger.log(`[INIT ${paymentType}] Booking: ${bookingId} | OrderID: ${orderId} | Amount: ${amount}`);

    const desc = isFull
      ? `Rental + Security Bond - ${booking.car.name}`
      : (isBond ? `Security Bond - ${booking.car.name}` : `Rental Fee - ${booking.car.name}`);

    const fields = {
      TERMINAL: terminal,
      TRTYPE: trType,
      AMOUNT: amount.toFixed(2),
      CURRENCY: 'PGK',
      ORDER: orderId,
      DESC: desc,
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

    const macString = this.kinaHmacService.buildRequestMacString({
      TERMINAL: fields.TERMINAL,
      TRTYPE: fields.TRTYPE,
      AMOUNT: fields.AMOUNT,
      CURRENCY: fields.CURRENCY,
      ORDER: fields.ORDER,
      MERCHANT: fields.MERCHANT,
      EMAIL: fields.EMAIL,
      BACKREF: fields.BACKREF,
      TIMESTAMP: fields.TIMESTAMP,
      MERCH_NAME: fields.MERCH_NAME,
      COUNTRY: fields.COUNTRY,
      MERCH_URL: fields.MERCH_URL,
      MERCH_GMT: fields.MERCH_GMT,
      DESC: fields.DESC,
      NONCE: fields.NONCE,
    });
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
        metadata: { paymentType, originalRentalAmount: booking.totalAmount, originalBondAmount: booking.bondAmount }
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
      this.logger.log('📨 KINA CALLBACK RECEIVED (Redirect Flow)');
      const result = await this.processPaymentResult(body);

      if (result.success) {
        return `${frontendUrl}/payment/success?bookingId=${result.bookingId}&payment=KINA&paymentStatus=PAID`;
      } else {
        if (result.reason === 'signature_mismatch' && result.action === '0') {
          return `${frontendUrl}/payment/error?reason=signature_mismatch`;
        }
        if (result.reason === 'order_not_found') {
          return `${frontendUrl}/payment/error?reason=order_not_found`;
        }
        if (result.trType === '24') {
          return `${frontendUrl}/admin/bookings/${result.bookingId}?error=refund_failed&rc=${result.rc}`;
        }

        const params = new URLSearchParams({
          order: result.orderId || '',
          id: result.carId || '',
          startDate: result.startDate?.toISOString() || '',
          endDate: result.endDate?.toISOString() || '',
          pickupLocation: result.pickupLocation || '',
          returnLocation: result.returnLocation || '',
        });

        return `${frontendUrl}/payment/${result.status?.toLowerCase()}?${params.toString()}`;
      }
    } catch (err: any) {
      this.logger.error(`💥 Unhandled exception in Kina callback: ${err.message}`, err.stack);
      return `${frontendUrl}/payment/error?reason=server_error`;
    }
  }

  async handleKinaWebhook(body: any): Promise<{ success: boolean; message?: string }> {
    try {
      this.logger.log('📨 KINA WEBHOOK RECEIVED (Server-to-Server Flow)');
      const result = await this.processPaymentResult(body);
      return { success: result.success, message: result.reason };
    } catch (err: any) {
      this.logger.error(`💥 Unhandled exception in Kina webhook: ${err.message}`, err.stack);
      return { success: false, message: 'Internal Server Error' };
    }
  }

  private async processPaymentResult(body: any): Promise<any> {
    const {
      ACTION, RC, APPROVAL, RRN, INT_REF,
      TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER,
      TIMESTAMP, NONCE, P_SIGN, MERCHANT,
    } = body;

    const kinaMerchantId = MERCHANT || this.configService.get<string>('KINA_MERCHANT_ID');

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

    if (!isValid && ACTION === '0') {
      this.logger.error(`❌ CRITICAL: Kina HMAC verification FAILED for SUCCESSFUL Order: ${ORDER}`);
      return { success: false, reason: 'signature_mismatch', action: ACTION, orderId: ORDER };
    }

    if (!isValid) {
      this.logger.warn(`⚠️ Kina HMAC mismatch on non-success result (ACTION=${ACTION} RC=${RC}).`);
    } else {
      this.logger.log(`✅ HMAC signature verified for Order: ${ORDER}`);
    }

    // ── 2. Locate payment record ──────────────────────────────────────────
    const payment = await this.prisma.payment.findUnique({
      where: { kinaOrderId: ORDER },
      include: { booking: { include: { car: true, user: true } } },
    });

    if (!payment) {
      this.logger.error(`❌ Payment record not found for Kina Order: ${ORDER}`);
      return { success: false, reason: 'order_not_found', orderId: ORDER };
    }

    // ── 3. Idempotency guard ──────────────────────────────────────────────
    // For TRTYPE 0 (Auth) we allow multiple hits if the second one is a Capture (21)
    if (payment.status === 'PAID' && TRTYPE !== '21') {
      this.logger.warn(`⚠️ Duplicate notification for already-PAID Order: ${ORDER}.`);
      return { success: true, bookingId: payment.bookingId, orderId: ORDER };
    }

    // ── 4. Atomic State Transition ────────────────────────────────────────
    if (ACTION === '0') {
      const result = await this.prisma.$transaction(async (tx) => {
        // Update the specific payment record
        await tx.payment.update({
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

        const bookingData: any = {};
        const metadata = payment.metadata as any;
        const isFullAuth = metadata?.paymentType === 'FULL' && TRTYPE === '0';

        if (TRTYPE === '24') bookingData.bondStatus = 'REFUNDED';
        else if (TRTYPE === '21') {
          // If this is a Capture, it marks the Rental Fee as PAID
          bookingData.paymentStatus = 'PAID';
          bookingData.status = 'CONFIRMED';
          bookingData.paidAt = new Date();
          bookingData.confirmedAt = new Date();
          // If it was part of a FULL flow, the bond is ALREADY marked as PAID by the Auth
        }
        else if (TRTYPE === '0') {
          // Authorization marks the bond as secured
          bookingData.bondStatus = 'PAID';
          // If it's a RENTAL ONLY Auth (unlikely in current config), it wouldn't confirm booking yet
          if (isFullAuth) {
            // We'll trigger the background capture for the rental fee right after this transaction
          }
        }
        else {
          // Standard Purchase (TRTYPE 1)
          const isBondPayment = metadata?.paymentType === 'BOND';
          const isFullPayment = metadata?.paymentType === 'FULL';

          if (isBondPayment) {
            bookingData.bondStatus = 'PAID';
          } else if (isFullPayment) {
            bookingData.paymentStatus = 'PAID';
            bookingData.bondStatus = 'PAID';
            bookingData.status = 'CONFIRMED';
            bookingData.paidAt = new Date();
            bookingData.confirmedAt = new Date();
          } else {
            // Standard Rental Purchase
            bookingData.paymentStatus = 'PAID';
            bookingData.status = 'CONFIRMED';
            bookingData.paidAt = new Date();
            bookingData.confirmedAt = new Date();
          }
        }

        const updatedBooking = await tx.booking.update({
          where: { id: payment.bookingId },
          data: bookingData,
          include: { car: true, user: true },
        });

        return { updatedBooking, isFullAuth };
      });

      this.logger.log(`✅ Booking ${payment.bookingId} processed via Kina Bank (TRTYPE: ${TRTYPE})`);

      // ── 5. Background Capture ─────────────────────────────────────────────
      // Background capture is ONLY needed if the initial transaction was TRTYPE 0 (Auth).
      // Since we now use TRTYPE 1 (Purchase) globally, we disable this background call.
      /*
      if (result.isFullAuth) {
        this.triggerBackgroundCapture(payment, body).catch(err =>
          this.logger.error(`❌ Background Capture failed: ${err.message}`)
        );
      }
      */

      this.bookingEmailService.sendKinaPaymentConfirmation(result.updatedBooking, INT_REF).catch((err) =>
        this.logger.error(`📧 Email send failed: ${err.message}`),
      );

      return { success: true, bookingId: payment.bookingId, orderId: ORDER };
    } else {
      const b = payment.booking;

      if (TRTYPE === '24') {
        this.logger.error(`❌ Kina Reversal FAILED for Order: ${ORDER} (RC: ${RC})`);
        await this.prisma.booking.update({
          where: { id: b.id },
          data: { bondStatus: 'PAID' }
        });
        return { success: false, trType: TRTYPE, bookingId: b.id, rc: RC, orderId: ORDER };
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

      return {
        success: false,
        status,
        orderId: ORDER,
        carId: b.carId,
        startDate: b.startDate,
        endDate: b.endDate,
        pickupLocation: b.pickupLocation,
        returnLocation: b.returnLocation,
        action: ACTION,
        rc: RC
      };
    }
  }

  private async triggerBackgroundCapture(payment: any, authBody: any) {
    this.logger.log(`🚀 Triggering Background Capture for Booking: ${payment.bookingId}`);

    const metadata = payment.metadata as any;
    const rentalAmount = metadata?.originalRentalAmount;
    if (!rentalAmount) {
      this.logger.error('❌ Cannot capture: originalRentalAmount missing in metadata');
      return;
    }

    const terminal = this.configService.get<string>('KINA_TERMINAL_ID');
    const backref = this.configService.get<string>('KINA_BACKREF_URL');
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
    const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();

    const fields = {
      TERMINAL: terminal,
      TRTYPE: '21',
      AMOUNT: rentalAmount.toFixed(2),
      CURRENCY: 'PGK',
      ORDER: payment.kinaOrderId,
      RRN: authBody.RRN,
      INT_REF: authBody.INT_REF,
      TIMESTAMP: timestamp,
      NONCE: nonce,
      BACKREF: backref,
    };

    const macString = this.kinaHmacService.buildManagementMacString({
      ORDER: fields.ORDER,
      AMOUNT: fields.AMOUNT,
      CURRENCY: fields.CURRENCY,
      RRN: fields.RRN,
      INT_REF: fields.INT_REF,
      TRTYPE: fields.TRTYPE,
      TERMINAL: fields.TERMINAL,
      TIMESTAMP: fields.TIMESTAMP,
      NONCE: fields.NONCE,
    });

    const pSign = this.kinaHmacService.computeHmac(macString);

    try {
      await this.executeKinaServerRequest({ ...fields, P_SIGN: pSign });
      this.logger.log(`✅ Background Capture request submitted for Order: ${payment.kinaOrderId}`);
    } catch (error: any) {
      this.logger.error(`💥 Background Capture request failed: ${error.message}`);
    }
  }

  private async executeKinaServerRequest(fields: any): Promise<any> {
    const gatewayUrl = this.configService.get<string>('KINA_GATEWAY_URL');
    if (!gatewayUrl) throw new Error('Kina Gateway URL is not configured');

    const params: Record<string, string> = {};
    Object.entries(fields).forEach(([k, v]) => {
      params[k] = String(v);
    });

    const formBody = new URLSearchParams(params);

    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    if (!response.ok) {
      throw new Error(`Kina Gateway responded with ${response.status}`);
    }

    return response;
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

    const kinaPayment = booking.payments.find((p) => {
      if (p.status !== 'PAID' || !p.kinaOrderId) return false;
      const typeDigit = p.kinaOrderId.charAt(14);
      return typeDigit === '9' || typeDigit === '1'; // Bond (9) or Full (1)
    });

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
      const reversalMacString = this.kinaHmacService.buildManagementMacString({
        ORDER: fields.ORDER,
        AMOUNT: fields.AMOUNT,
        CURRENCY: fields.CURRENCY,
        RRN: fields.RRN,
        INT_REF: fields.INT_REF,
        TRTYPE: fields.TRTYPE,
        TERMINAL: fields.TERMINAL,
        TIMESTAMP: fields.TIMESTAMP,
        NONCE: fields.NONCE,
      });

      const pSign = this.kinaHmacService.computeHmac(reversalMacString);

      try {
        await this.executeKinaServerRequest({ ...fields, P_SIGN: pSign });

        // Mark as pending until webhook confirmation
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { bondStatus: 'REFUND_PENDING' },
        });

        return {
          success: true,
          message: 'Refund Bond request submitted successfully in background',
          status: 'REFUND_PENDING'
        };
      } catch (error: any) {
        this.logger.error(`💥 Background Reversal failed: ${error.message}`);

        const testMode = this.configService.get<string>('KINA_TEST_MODE') === 'true';
        if (testMode) {
          this.logger.warn('🧪 KINA_TEST_MODE: Auto-confirming refund because sandbox often rejects TRTYPE 24');
          await this.prisma.booking.update({
            where: { id: booking.id },
            data: { bondStatus: 'REFUNDED' },
          });
          return { success: true, message: 'Bond refunded (Mock Success - Test Mode)', status: 'REFUNDED' };
        }

        throw new InternalServerErrorException(`Kina reversal failed: ${error.message}`);
      }
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
    // In Purchase-Reversal flow, funds were collected immediately at purchase (TRTYPE 1).
    // Capture here is just a logical transition in the database.
    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { bondStatus: 'CLAIMED' },
    });

    return {
      success: true,
      message: 'Bond marked as CLAIMED in system. Note: Funds were already collected during initial purchase.',
      status: 'CLAIMED'
    };
  }
}
