import { IsNumber, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE';

export class CreateBookingDto {
  @IsString()
  userId!: string;

  @IsString()
  carId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsNumber()
  totalAmount!: number;

  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status!: BookingStatus;

  @IsEnum(['PENDING', 'PAID', 'FAILED'])
  paymentStatus!: PaymentStatus;

  @IsEnum(['CASH', 'CARD', 'ONLINE'])
  paymentMethod!: PaymentMethod;

  @IsString()
  customerName!: string;

  @IsString()
  customerEmail!: string;

  @IsString()
  customerPhone!: string;

  @IsString()
  @IsOptional()
  pickupLocation?: string;

  @IsString()
  @IsOptional()
  returnLocation?: string;
}
