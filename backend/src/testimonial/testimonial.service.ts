import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { CloudinaryService } from '../lib/cloudinary.service';

@Injectable()
export class TestimonialService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService
    ) { }

    async create(createTestimonialDto: CreateTestimonialDto, file?: Express.Multer.File) {
        if (file) {
            const upload = await this.cloudinary.uploadFile(file);
            createTestimonialDto.avatar = upload.secure_url;
        }
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

    async update(id: string, updateTestimonialDto: UpdateTestimonialDto, file?: Express.Multer.File) {
        try {
            if (file) {
                const upload = await this.cloudinary.uploadFile(file);
                updateTestimonialDto.avatar = upload.secure_url;
            }
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
