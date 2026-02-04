import { IsString, IsNumber, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { CarStatus } from '@prisma/client';

export class CreateCarDto {
  @IsString()
  name!: string;

  @IsString()
  brand!: string;

  @IsString()
  type!: string;

  @IsString()
  transmission!: string;

  @IsInt()
  @Min(0)
  fuelCapacity!: number;

  @IsNumber()
  @Min(0)
  pricePerDay!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CarStatus)
  status?: CarStatus;
}
