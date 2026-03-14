import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { SettingsService } from '../settings/settings.service';
import { StripeService } from './stripe.service';
import { BookingEmailService } from '../booking/services/booking.email.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly settingsService: SettingsService,
    private readonly stripeService: StripeService,
    private readonly bookingEmailService: BookingEmailService,
  ) { }

  async createCheckoutSession(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const settings = await this.settingsService.getSettings();
    const currency = 'pgk'; // Force PGK

    try {
      // H1 — idempotency key: same bookingId always produces the same session
      const session = await this.stripeService.createCheckoutSession({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: booking.car.name,
                description: `Car Rental from ${booking.startDate.toISOString().split('T')[0]} to ${booking.endDate.toISOString().split('T')[0]}`,
                images: booking.car.imageUrl ? [booking.car.imageUrl] : [],
              },
              unit_amount: Math.round(booking.totalAmount * 100),
            },
            quantity: 1,
          },
          {
            price_data: {
              currency: currency,
              product_data: {
                name: 'Security Bond (Refundable)',
                description: 'This deposit will be refunded after the vehicle is returned in good condition.',
              },
              unit_amount: Math.round(booking.bondAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/thank-you?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}&carName=${booking.car.name}&total=${booking.totalAmount}&startDate=${booking.startDate.toISOString()}&endDate=${booking.endDate.toISOString()}&payment=STRIPE`,
        cancel_url: `${frontendUrl}/checkoutpage?id=${booking.carId}&error=payment_cancelled`,
        metadata: {
          bookingId: booking.id,
          userId: booking.userId,
        },
        payment_intent_data: {
          metadata: {
            bookingId: booking.id,
            userId: booking.userId,
          },
        },
      }, `checkout-${booking.id}`); // deterministic idempotency key

      // Check for existing payment record (usually created during booking)
      const existingPayment = await this.prisma.payment.findFirst({
        where: { bookingId: booking.id },
      });

      if (existingPayment) {
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            stripePaymentIntentId: session.id, // Keeping this for backward compatibility or initial tracking
            stripeSessionId: session.id,
            status: 'PENDING',
            paymentMethod: 'ONLINE',
            currency: 'PGK',
          },
        });
      } else {
        await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount + booking.bondAmount,
            currency: 'PGK',
            status: 'PENDING',
            stripePaymentIntentId: session.id,
            stripeSessionId: session.id,
            paymentMethod: 'ONLINE',
          },
        });
      }

      return { url: session.url };
    } catch (error) {
      console.error('Stripe Checkout Session Error:', error);
      throw new InternalServerErrorException('Failed to create checkout session');
    }
  }

  async createPaymentIntent(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const settings = await this.settingsService.getSettings();
    const currency = 'pgk'; // Force PGK

    try {
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: Math.round((booking.totalAmount + booking.bondAmount) * 100), // Amount in cents
        currency: currency,
        metadata: { bookingId: booking.id, userId: booking.userId },
        description: `Car Rental - Booking #${booking.id}`,
      });

      // Check for existing payment record
      const existingPayment = await this.prisma.payment.findFirst({
        where: { bookingId: booking.id },
      });

      if (existingPayment) {
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            stripePaymentIntentId: paymentIntent.id,
            amount: booking.totalAmount + booking.bondAmount,
            status: 'PENDING',
            paymentMethod: 'ONLINE',
            currency: 'PGK'
          },
        });
      } else {
        await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount + booking.bondAmount,
            currency: 'PGK',
            status: 'PENDING',
            stripePaymentIntentId: paymentIntent.id,
            paymentMethod: 'ONLINE',
          },
        });
      }

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    console.log('========================================');
    console.log('📨 STRIPE WEBHOOK RECEIVED');
    console.log('========================================');

    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('❌ Webhook secret not configured');
      throw new InternalServerErrorException('Stripe webhook secret not configured');
    }
    let event: Stripe.Event;

    try {
      event = this.stripeService.constructEvent(payload, signature, webhookSecret);
      console.log(`✅ Webhook signature verified for event: ${event.type}`);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed!');
      console.error('Error:', err.message);
      console.log('Received signature:', signature);
      console.log('Using secret:', webhookSecret.substring(0, 10) + '...');
      throw new InternalServerErrorException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      // H3 — handle session expiry (customer abandoned payment page)
      case 'checkout.session.expired':
        await this.handleSessionExpired(event.data.object as Stripe.Checkout.Session);
        break;
      // H3 — handle card-declined / payment failure inside the hosted page
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        this.logger.log(`ℹ️  Unhandled Stripe event: ${event.type}`);
    }

    console.log('========================================');
    console.log('✅ WEBHOOK PROCESSING COMPLETE');
    console.log('========================================');
    return { received: true };
  }

  private async handleChargeRefunded(charge: Stripe.Charge) {
    const bookingId = charge.metadata?.bookingId;
    if (!bookingId) {
      console.warn('⚠️ charge.refunded webhook missing bookingId in metadata');
      return;
    }

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      console.error(`❌ charge.refunded: booking not found for id: ${bookingId}`);
      return;
    }

    // Only update if we're in the expected intermediate state
    if (booking.bondStatus !== 'REFUND_PENDING') {
      console.warn(`⚠️ charge.refunded: booking ${bookingId} bondStatus is '${booking.bondStatus}', expected 'REFUND_PENDING'. Skipping.`);
      return;
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { bondStatus: 'REFUNDED' }
    });
    console.log(`✅ Bond status confirmed REFUNDED via Stripe webhook for booking: ${bookingId}`);
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    this.logger.log('💳 Processing checkout.session.completed event');
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      this.logger.error('❌ No bookingId found in session metadata');
      return;
    }

    try {
      console.log(`🔄 Updating payment and booking status for booking: ${bookingId}`);
      // Check for existing payment
      const existingPayment = await this.prisma.payment.findFirst({
        where: { bookingId: bookingId as string }
      });

      if (existingPayment) {
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'PAID',
            stripePaymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id
          }
        });
      } else {
        // Create missing payment record
        await this.prisma.payment.create({
          data: {
            bookingId: bookingId as string,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: 'PGK',
            status: 'PAID',
            stripePaymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id,
            paymentMethod: 'ONLINE'
          }
        });
      }

      // Update booking status
      const updatedBooking = await this.prisma.booking.update({
        where: { id: bookingId as string },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          bondStatus: 'PAID'
        },
        include: { car: true, user: true }
      });

      this.logger.log(`✅ Payment and booking status updated successfully`);
      await this.bookingEmailService.sendStripePaymentConfirmation(updatedBooking, session.payment_intent as string);
    } catch (err) {
      this.logger.error('❌ Failed to update booking/payment status:', err);
      throw err;
    }
  }

  // H3 — session expired (customer left the Stripe hosted page without paying)
  private async handleSessionExpired(session: Stripe.Checkout.Session) {
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) return;

    try {
      await this.prisma.payment.updateMany({
        where: { bookingId, status: 'PENDING' },
        data: { status: 'FAILED' },
      });
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'FAILED', status: 'CANCELLED', cancelledAt: new Date() },
      });
      this.logger.warn(`⏰ Session expired — booking ${bookingId} cancelled`);
    } catch (err) {
      this.logger.error(`❌ handleSessionExpired failed for booking ${bookingId}:`, err);
    }
  }

  // H3 — payment intent failed (card declined etc.)
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata?.bookingId;
    if (!bookingId) return;

    try {
      await this.prisma.payment.updateMany({
        where: { bookingId, status: 'PENDING' },
        data: { status: 'FAILED' },
      });
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'FAILED' },
      });
      this.logger.warn(`💳 Payment failed — booking ${bookingId} marked FAILED. Reason: ${paymentIntent.last_payment_error?.message}`);
    } catch (err) {
      this.logger.error(`❌ handlePaymentFailed failed for booking ${bookingId}:`, err);
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

    // Guard: prevent duplicate refund attempts
    if (booking.bondStatus === 'REFUNDED') {
      throw new BadRequestException('Bond has already been refunded');
    }
    if (booking.bondStatus === 'REFUND_PENDING') {
      throw new BadRequestException('Bond refund is already in progress — awaiting Stripe confirmation');
    }
    if (booking.bondStatus !== 'PAID') {
      throw new BadRequestException(`Cannot release bond — current status is '${booking.bondStatus}'`);
    }

    const stripePayment = booking.payments.find((p) => p.stripePaymentIntentId && p.status === 'PAID');

    if (booking.paymentMethod === 'ONLINE' && stripePayment?.stripePaymentIntentId) {
      // ── Production-grade Stripe refund ──────────────────────────────────────
      // Idempotency key: deterministic per booking so retrying this endpoint
      // returns the existing refund instead of creating a second charge.
      const idempotencyKey = `bond-refund-${booking.id}`;

      let refund: Stripe.Refund;
      try {
        refund = await this.stripeService.createRefund(
          {
            payment_intent: stripePayment.stripePaymentIntentId,
            amount: Math.round(booking.bondAmount * 100),
            metadata: { bookingId: booking.id, type: 'BOND_REFUND' },
          },
          idempotencyKey,
        );
      } catch (error) {
        console.error('Stripe Refund Error:', error);
        throw new InternalServerErrorException('Failed to initiate Stripe refund');
      }

      console.log(`🔄 Stripe refund initiated: refundId=${refund.id}, status=${refund.status}`);

      // Store refundId for audit trail
      await this.prisma.payment.update({
        where: { id: stripePayment.id },
        data: {
          metadata: {
            ...(stripePayment.metadata as object ?? {}),
            stripeRefundId: refund.id,
            refundInitiatedAt: new Date().toISOString(),
          },
        },
      });

      // Intermediate state: REFUND_PENDING → set to REFUNDED only by the
      // charge.refunded webhook (single source of truth)
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { bondStatus: 'REFUND_PENDING' },
      });

      return {
        message: 'Bond refund initiated. Status will update to REFUNDED once Stripe confirms.',
        refundId: refund.id,
        refundStatus: refund.status,
      };
    } else {
      // Cash booking or no Stripe PI — admin manually returning cash, mark directly
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { bondStatus: 'REFUNDED' },
      });
      return { message: 'Bond marked as refunded (cash/manual payment)' };
    }
  }
}
