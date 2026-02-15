import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { PrismaService } from '../lib/prisma.service';
import { CloudinaryService } from '../lib/cloudinary.service';

@Module({
    controllers: [TestimonialController],
    providers: [TestimonialService, PrismaService, CloudinaryService],
    exports: [TestimonialService],
})
export class TestimonialModule { }
