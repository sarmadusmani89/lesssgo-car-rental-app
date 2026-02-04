import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
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

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${booking.car.brand} ${booking.car.name}`,
                description: `Car Rental from ${booking.startDate.toISOString().split('T')[0]} to ${booking.endDate.toISOString().split('T')[0]}`,
                images: booking.car.imageUrl ? [booking.car.imageUrl] : [],
              },
              unit_amount: Math.round(booking.totalAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/thank-you?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}&carName=${booking.car.name}&total=${booking.totalAmount}&startDate=${booking.startDate.toISOString().split('T')[0]}&endDate=${booking.endDate.toISOString().split('T')[0]}&payment=STRIPE`,
        cancel_url: `${frontendUrl}/checkoutpage?id=${booking.carId}&error=payment_cancelled`,
        metadata: {
          bookingId: booking.id,
          userId: booking.userId,
        },
      });

      // Create a local payment record
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          currency: 'usd',
          status: 'PENDING',
          stripePaymentIntentId: session.id, // For session tracking
          paymentMethod: 'ONLINE',
        },
      });

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

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Amount in cents
        currency: 'usd',
        metadata: { bookingId: booking.id, userId: booking.userId },
        description: `Car Rental - Booking #${booking.id}`,
      });

      // Create a local payment record
      await this.prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          currency: 'usd',
          status: 'PENDING',
          stripePaymentIntentId: paymentIntent.id,
          paymentMethod: 'ONLINE',
        },
      });

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
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new InternalServerErrorException('Stripe webhook secret not configured');
    }
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      throw new InternalServerErrorException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.bookingId;

      await this.prisma.$transaction([
        this.prisma.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: 'PAID' },
        }),
        this.prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        }),
      ]);
    }

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
