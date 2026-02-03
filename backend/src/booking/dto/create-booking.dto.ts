import { IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  vehicleId!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsNumber()
  totalAmount!: number;

  @IsEnum(['pending', 'confirmed', 'cancelled', 'completed'])
  status!: BookingStatus;

  @IsEnum(['pending', 'paid', 'failed'])
  paymentStatus!: PaymentStatus;

  @IsEnum(['cash', 'card', 'online'])
  paymentMethod!: PaymentMethod;

  @IsString()
  customerName!: string;

  @IsString()
  customerEmail!: string;

  @IsString()
  customerPhone!: string;
}
