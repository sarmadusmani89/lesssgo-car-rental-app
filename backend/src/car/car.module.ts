import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { CloudinaryService } from '../lib/cloudinary.service';
import { CloudinaryProvider } from '../lib/cloudinary.provider';

@Module({
  controllers: [CarController],
  providers: [CarService, CloudinaryService, CloudinaryProvider],
  exports: [CarService],
})
export class CarModule { }
