import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { PrismaService } from '../lib/prisma.service';

@Module({
    controllers: [TestimonialController],
    providers: [TestimonialService, PrismaService],
    exports: [TestimonialService],
})
export class TestimonialModule { }
