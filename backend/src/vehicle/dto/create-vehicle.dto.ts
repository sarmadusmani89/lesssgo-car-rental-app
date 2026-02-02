import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { VehicleStatus } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsNumber()
  dailyPrice!: number;

  @IsOptional()
  @IsArray()
  features?: Record<string, any>[];

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsEnum(['available', 'unavailable'])
  status?: VehicleStatus;
}
