import { IsNumber, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  bookingId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  stripePaymentIntentId?: string;

  @IsEnum(PaymentStatus)
  status!: PaymentStatus;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
