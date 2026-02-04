import { IsString, IsNumber, IsOptional, IsEnum, IsInt, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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
  @Type(() => Number)
  fuelCapacity!: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  pricePerDay!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  hp!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CarStatus)
  status?: CarStatus;

  @IsOptional()
  image?: any;
}
