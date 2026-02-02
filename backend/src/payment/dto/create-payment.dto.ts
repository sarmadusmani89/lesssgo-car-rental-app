import { IsNumber, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  bookingId!: number;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsEnum(['cash', 'card', 'online'])
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;

  @IsEnum(['pending', 'succeeded', 'failed'])
  status!: PaymentStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
