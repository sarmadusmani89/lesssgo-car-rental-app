import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialService {
    constructor(private prisma: PrismaService) { }

    async create(createTestimonialDto: CreateTestimonialDto) {
        return this.prisma.testimonial.create({
            data: createTestimonialDto,
        });
    }

    async findAll() {
        return this.prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const testimonial = await this.prisma.testimonial.findUnique({
            where: { id },
        });
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }
        return testimonial;
    }

    async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
        try {
            return await this.prisma.testimonial.update({
                where: { id },
                data: updateTestimonialDto,
            });
        } catch (error) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.testimonial.delete({
                where: { id },
            });
        } catch (error) {
            throw new NotFoundException(`Testimonial with ID ${id} not found`);
        }
    }
}
