import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';
import { CarStatus } from '../entities/car.entity';

export class CreateCarDto {
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
  status?: CarStatus;
}
