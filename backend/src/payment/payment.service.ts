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

    const orderId = `LG-${Date.now()}-${booking.id.split('-')[0]}`.toUpperCase();
    const nonce = crypto.randomBytes(16).toString('hex').toUpperCase();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14); // YYYYMMDDHHMMSS

    const fields = {
      TERMINAL: terminal,
      TRTYPE: '0', // 0 for Sales
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

  async handleKinaCallback(body: any) {
    this.logger.log('📨 KINA CALLBACK RECEIVED');
    
    const {
      ACTION, RC, APPROVAL, STAN, RRN, INT_REF,
      TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER,
      TIMESTAMP, NONCE, P_SIGN,
    } = body;

    const macString = this.kinaHmacService.buildResponseMacString({
      ACTION, RC, APPROVAL, STAN, RRN, INT_REF,
      TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER,
      TIMESTAMP, NONCE,
    });

    const isValid = this.kinaHmacService.verifySignature(macString, P_SIGN);
    if (!isValid) {
      this.logger.error(`❌ Kina HMAC verification FAILED for Order: ${ORDER}`);
      return `${this.configService.get('FRONTEND_URL')}/payment/error?reason=signature_mismatch`;
    }

    const payment = await this.prisma.payment.findUnique({
      where: { kinaOrderId: ORDER },
      include: { booking: { include: { car: true, user: true } } },
    });

    if (!payment) {
      this.logger.error(`❌ Payment record not found for Kina Order: ${ORDER}`);
      return `${this.configService.get('FRONTEND_URL')}/payment/error?reason=order_not_found`;
    }

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
        },
        include: { car: true, user: true },
      });

      await this.bookingEmailService.sendKinaPaymentConfirmation(updatedBooking, INT_REF); // Reuse logic for now
      return `${this.configService.get('FRONTEND_URL')}/thank-you?bookingId=${payment.bookingId}&payment=KINA&paymentStatus=PAID`;
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

      return `${this.configService.get('FRONTEND_URL')}/payment/${status.toLowerCase()}?order=${ORDER}`;
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
      const merchant = this.configService.get<string>('KINA_MERCHANT_ID');
      const backref = this.configService.get<string>('KINA_BACKREF_URL');
      
      const nonce = nodeCrypto.randomBytes(16).toString('hex').toUpperCase();
      const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);

      const fields = {
        TERMINAL: terminal,
        TRTYPE: '24', // Reversal
        AMOUNT: booking.bondAmount.toFixed(2),
        CURRENCY: 'PGK',
        ORDER: kinaPayment.kinaOrderId,
        RRN: kinaPayment.kinaRrn,
        INT_REF: kinaPayment.kinaIntRef,
        TIMESTAMP: timestamp,
        NONCE: nonce,
        BACKREF: backref,
      };

      // Since reversals on the gateway need to be a form post, we return the fields
      // and mark the status as pending admin verification
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { bondStatus: 'REFUND_PENDING' },
      });

      return {
        isKinaReversal: true,
        gatewayUrl: this.configService.get('KINA_GATEWAY_URL'),
        fields: {
          ...fields,
          P_SIGN: this.kinaHmacService.computeHmac(
            // Order for reversal MAC is different in some versions, but standard IPG order:
            // TERMINAL, TRTYPE, AMOUNT, CURRENCY, ORDER, RRN, INT_REF, TIMESTAMP, NONCE, BACKREF
            [fields.TERMINAL, fields.TRTYPE, fields.AMOUNT, fields.CURRENCY, fields.ORDER, fields.RRN, fields.INT_REF, fields.TIMESTAMP, fields.NONCE, fields.BACKREF]
              .map(val => (val ? `${val.length}${val}` : '-'))
              .join('')
          ),
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
