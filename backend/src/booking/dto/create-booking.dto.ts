import { IsNumber, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type BondStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'CLAIMED';
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

  @IsNumber()
  @IsOptional()
  bondAmount?: number;

  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status!: BookingStatus;

  @IsEnum(['PENDING', 'PAID', 'FAILED'])
  paymentStatus!: PaymentStatus;

  @IsEnum(['PENDING', 'PAID', 'REFUNDED', 'CLAIMED'])
  @IsOptional()
  bondStatus?: BondStatus;

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
