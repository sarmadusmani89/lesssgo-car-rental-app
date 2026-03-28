import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { CloudinaryService } from '../lib/cloudinary.service';
import { CloudinaryProvider } from '../lib/cloudinary.provider';
@Module({
    controllers: [TestimonialController],
    providers: [TestimonialService, CloudinaryService, CloudinaryProvider],
    exports: [TestimonialService],
})
export class TestimonialModule { }
