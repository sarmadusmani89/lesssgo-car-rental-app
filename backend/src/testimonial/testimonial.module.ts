import { Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { LibModule } from '../lib/lib.module';

@Module({
    imports: [LibModule],
    controllers: [TestimonialController],
    providers: [TestimonialService],
    exports: [TestimonialService],
})
export class TestimonialModule { }
