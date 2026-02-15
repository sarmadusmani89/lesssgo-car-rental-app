import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('testimonials')
export class TestimonialController {
    constructor(private readonly testimonialService: TestimonialService) { }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createTestimonialDto: CreateTestimonialDto
    ) {
        return this.testimonialService.create(createTestimonialDto, file);
    }

    @Get()
    findAll() {
        return this.testimonialService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testimonialService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateTestimonialDto: UpdateTestimonialDto,
    ) {
        return this.testimonialService.update(id, updateTestimonialDto, file);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.testimonialService.remove(id);
    }
}
