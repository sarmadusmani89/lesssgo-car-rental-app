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
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
    return value;
  })
  pickupLocation?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
    return value;
  })
  returnLocation?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  passengers?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  freeCancellation?: boolean;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.includes(',')) return value.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof value === 'string') return [value];
    return value;
  })
  gallery?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  airConditioner?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  gps?: boolean;

  @IsOptional()
  @IsString()
  vehicleClass?: string;

  @IsOptional()
  image?: any;
}
