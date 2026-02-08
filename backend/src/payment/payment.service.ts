import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EmailService } from '../email/email.service';
import { SettingsService } from '../settings/settings.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly settingsService: SettingsService,
    private readonly stripeService: StripeService,
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
      });

      // Check for existing payment record (usually created during booking)
      const existingPayment = await this.prisma.payment.findFirst({
        where: { bookingId: booking.id },
      });

      if (existingPayment) {
        await this.prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            stripePaymentIntentId: session.id,
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
      console.log(`✅ Webhook signature verified`);
      console.log(`📋 Event Type: ${event.type}`);
      console.log(`🆔 Event ID: ${event.id}`);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      throw new InternalServerErrorException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        console.log(`ℹ️  Unhandled event type: ${event.type} - Ignoring`);
    }

    console.log('========================================');
    console.log('✅ WEBHOOK PROCESSING COMPLETE');
    console.log('========================================');
    return { received: true };
  }

  private async handleChargeRefunded(charge: Stripe.Charge) {
    const bookingId = charge.metadata?.bookingId;
    if (bookingId) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { bondStatus: 'REFUNDED' }
      });
      console.log(`✅ Bond status updated to REFUNDED via webhook for booking: ${bookingId}`);
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log('💳 Processing checkout.session.completed event');
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error('❌ No bookingId found in session metadata');
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
          data: { status: 'PAID', stripePaymentIntentId: session.payment_intent as string }
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

      console.log(`✅ Payment and booking status updated successfully`);
      await this.sendPaymentConfirmationEmails(updatedBooking, session.payment_intent as string);
    } catch (err) {
      console.error('❌ Failed to update booking/payment status:', err);
      throw err;
    }
  }

  private async sendPaymentConfirmationEmails(booking: any, transactionId: string) {
    try {
      console.log('📧 Sending payment confirmation emails...');
      const { user, car, startDate, endDate, totalAmount, customerName: snapName, customerEmail: snapEmail } = booking;
      const customerName = snapName || user.name || 'Valued Customer';
      const customerEmail = snapEmail || user.email;

      const formatOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      };
      const start = new Date(startDate).toLocaleString('en-AU', formatOptions);
      const end = new Date(endDate).toLocaleString('en-AU', formatOptions);

      const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');
      const { paymentReceiptTemplate } = await import('../lib/emailTemplates/paymentReceipt');

      const confirmHtml = bookingConfirmationTemplate({
        customerName,
        bookingId: booking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        bondAmount: booking.bondAmount,
        paymentMethod: 'ONLINE',
        isConfirmed: true,
        hp: car.hp,
        passengers: car.passengers,
        fuelType: car.fuelType,
        transmission: car.transmission,
        airConditioner: car.airConditioner,
        gps: car.gps,
        vehicleClass: car.vehicleClass,
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
        customTitle: 'Booking Confirmed',
        customDescription: 'Great news! Your online payment was successful and your booking is officially confirmed.'
      });

      const receiptHtml = paymentReceiptTemplate({
        customerName,
        amount: totalAmount,
        bondAmount: booking.bondAmount,
        bookingId: booking.id,
        paymentMethod: 'Stripe Online',
        transactionId,
        date: new Date().toLocaleDateString(),
      });

      const settings = await this.settingsService.getSettings();
      const { adminBookingNotificationTemplate } = await import('../lib/emailTemplates/adminBookingNotification');

      const adminHtml = adminBookingNotificationTemplate({
        customerName,
        customerEmail,
        customerPhone: user.phoneNumber || 'N/A',
        bookingId: booking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        bondAmount: booking.bondAmount,
        paymentMethod: 'ONLINE',
        paymentStatus: 'Confirmed (Paid via Stripe)',
        hp: car.hp,
        vehicleClass: car.vehicleClass,
        transmission: car.transmission,
        fuelType: car.fuelType,
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
        customTitle: 'Booking Paid - Stripe',
        customDescription: `Online payment received via Stripe for booking #${booking.id.slice(-8).toUpperCase()}. Booking is now fully confirmed.`
      });

      await Promise.all([
        this.emailService.sendEmail(customerEmail, 'Booking & Payment Confirmed - LesssGo', confirmHtml),
        this.emailService.sendEmail(customerEmail, 'Payment Receipt - LesssGo', receiptHtml),
        this.emailService.sendEmail(settings.adminEmail, 'Booking Paid: Stripe Payment Received', adminHtml)
      ]);
      console.log('✅ Payment confirmation emails sent successfully');
    } catch (err) {
      console.error('❌ Failed to send payment success emails:', err);
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
    if (booking.bondStatus !== 'PAID') throw new BadRequestException('Bond is not in PAID status');

    // Find the Stripe Payment Intent from the payments
    const stripePayment = booking.payments.find((p) => p.stripePaymentIntentId && p.status === 'PAID');

    if (booking.paymentMethod === 'ONLINE' && stripePayment && stripePayment.stripePaymentIntentId) {
      // Stripe Refund
      try {
        await this.stripeService.createRefund({
          payment_intent: stripePayment.stripePaymentIntentId,
          amount: Math.round(booking.bondAmount * 100),
          metadata: { bookingId: booking.id, type: 'BOND_REFUND' },
        });
        // Status will be updated via webhook (charge.refunded), 
        // but we update it now for better UI feedback
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { bondStatus: 'REFUNDED' },
        });
      } catch (error) {
        console.error('Stripe Refund Error:', error);
        throw new InternalServerErrorException('Failed to process Stripe refund');
      }
    } else {
      // Cash or no Stripe PI found - Manual marker
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { bondStatus: 'REFUNDED' },
      });
    }

    return { message: 'Bond released successfully' };
  }
}
