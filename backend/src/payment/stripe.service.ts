import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private readonly configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!secretKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        this.stripe = new Stripe(secretKey, {
            apiVersion: '2025-01-27.acacia' as any,
        });
    }

    async createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
        try {
            return await this.stripe.checkout.sessions.create(params);
        } catch (error) {
            console.error('Stripe Checkout Session Error:', error);
            throw new InternalServerErrorException('Failed to create checkout session');
        }
    }

    async createPaymentIntent(params: Stripe.PaymentIntentCreateParams) {
        try {
            return await this.stripe.paymentIntents.create(params);
        } catch (error) {
            console.error('Stripe Payment Intent Error:', error);
            throw new InternalServerErrorException('Failed to create payment intent');
        }
    }

    async createRefund(params: Stripe.RefundCreateParams) {
        try {
            return await this.stripe.refunds.create(params);
        } catch (error) {
            console.error('Stripe Refund Error:', error);
            throw new InternalServerErrorException('Failed to process Stripe refund');
        }
    }

    constructEvent(payload: Buffer, signature: string, secret: string): Stripe.Event {
        return this.stripe.webhooks.constructEvent(payload, signature, secret);
    }
}
