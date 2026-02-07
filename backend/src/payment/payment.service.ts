import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EmailService } from '../email/email.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly settingsService: SettingsService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createCheckoutSession(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true, user: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    const settings = await this.settingsService.getSettings();
    const currency = settings.currency.toLowerCase();

    try {
      const session = await this.stripe.checkout.sessions.create({
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
          },
        });
      } else {
        await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            currency: currency,
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
    const currency = settings.currency.toLowerCase();

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Amount in cents
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
            status: 'PENDING',
            paymentMethod: 'ONLINE',
          },
        });
      } else {
        await this.prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            currency: currency,
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
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      console.log(`✅ Webhook signature verified`);
      console.log(`📋 Event Type: ${event.type}`);
      console.log(`🆔 Event ID: ${event.id}`);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      throw new InternalServerErrorException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      console.log('💳 Processing checkout.session.completed event');
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      console.log(`🔍 Session ID: ${session.id}`);
      console.log(`📦 Booking ID from metadata: ${bookingId}`);
      console.log(`💰 Payment Intent: ${session.payment_intent}`);
      console.log(`💵 Amount Total: ${session.amount_total ? session.amount_total / 100 : 'N/A'} ${session.currency?.toUpperCase()}`);

      if (!bookingId) {
        console.error('❌ No bookingId found in session metadata');
        return { received: true };
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
              currency: session.currency || 'usd',
              status: 'PAID',
              stripePaymentIntentId: session.payment_intent as string,
              paymentMethod: 'ONLINE'
            }
          });
        }

        // Update booking status
        const updatedBooking = await this.prisma.booking.update({
          where: { id: bookingId as string },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
          include: { car: true }
        });
        console.log(`✅ Payment and booking status updated successfully`);
        console.log(`📊 Updated Booking: ${updatedBooking.id} | Status: ${updatedBooking.status} | Payment: ${updatedBooking.paymentStatus}`);

        // Send confirmation emails for successful payment
        try {
          console.log('📧 Sending payment confirmation emails...');
          const { customerName, customerEmail, car, startDate, endDate, totalAmount } = updatedBooking;
          const start = new Date(startDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
          const end = new Date(endDate).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

          const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');
          const { paymentReceiptTemplate } = await import('../lib/emailTemplates/paymentReceipt');

          const confirmHtml = bookingConfirmationTemplate({
            customerName,
            bookingId: updatedBooking.id,
            brand: car.brand,
            vehicleName: car.name,
            startDate: start,
            endDate: end,
            totalAmount,
            paymentMethod: 'ONLINE',
            isConfirmed: true,
            hp: car.hp,
            passengers: car.passengers,
            fuelType: car.fuelType,
            transmission: car.transmission,
            airConditioner: car.airConditioner,
            gps: car.gps,
            vehicleClass: car.vehicleClass,
          });

          const receiptHtml = paymentReceiptTemplate({
            customerName,
            amount: totalAmount,
            bookingId: updatedBooking.id,
            paymentMethod: 'Stripe Online',
            transactionId: session.payment_intent as string,
            date: new Date().toLocaleDateString(),
          });

          // Fetch admin email
          const settings = await this.settingsService.getSettings();

          const { adminBookingNotificationTemplate } = await import('../lib/emailTemplates/adminBookingNotification');
          const adminHtml = adminBookingNotificationTemplate({
            customerName,
            customerEmail,
            customerPhone: updatedBooking.customerPhone || 'N/A',
            bookingId: updatedBooking.id,
            brand: car.brand,
            vehicleName: car.name,
            startDate: start,
            endDate: end,
            totalAmount,
            paymentMethod: 'ONLINE',
            paymentStatus: 'Confirmed (Paid via Stripe)',
            hp: car.hp,
            vehicleClass: car.vehicleClass,
          });

          await Promise.all([
            this.emailService.sendEmail(customerEmail, 'Booking Confirmed - LesssGo', confirmHtml),
            this.emailService.sendEmail(customerEmail, 'Payment Receipt - LesssGo', receiptHtml),
            this.emailService.sendEmail(settings.adminEmail, 'New Booking Alert - Payment Received', adminHtml)
          ]);
          console.log('✅ Payment confirmation emails sent successfully');
          console.log(`   → User email: ${customerEmail}`);
          console.log(`   → Admin email: ${settings.adminEmail}`);
        } catch (err) {
          console.error('❌ Failed to send payment success emails:', err);
        }
      } catch (err) {
        console.error('❌ Failed to update booking/payment status:', err);
        throw err;
      }
    } else {
      console.log(`ℹ️  Unhandled event type: ${event.type} - Ignoring`);
    }

    console.log('========================================');
    console.log('✅ WEBHOOK PROCESSING COMPLETE');
    console.log('========================================');
    return { received: true };
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
}
