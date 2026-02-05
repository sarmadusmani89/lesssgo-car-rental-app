import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CloudinaryService } from '../lib/cloudinary.service';

@Injectable()
export class CarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) { }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(createCarDto: CreateCarDto, file: Express.Multer.File, galleryFiles?: Express.Multer.File[]) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    let slug = this.generateSlug(createCarDto.name);
    // basic uniqueness check or allow prisma to throw
    // Ideally we append a suffix if it exists, but for now we'll rely on the unique constraint or simple retry with timestamp if needed.
    // For a rental fleet, names like "Land Cruiser 1", "Land Cruiser 2" are common if they are distinct cars.
    // Or we just use the name as is.

    try {
      const upload = await this.cloudinary.uploadFile(file);
      createCarDto.imageUrl = upload.secure_url;

      if (galleryFiles && galleryFiles.length > 0) {
        const galleryUrls = await Promise.all(
          galleryFiles.map(f => this.cloudinary.uploadFile(f).then(res => res.secure_url))
        );
        createCarDto.gallery = galleryUrls;
      }
    } catch (error) {
      throw new BadRequestException('Failed to upload images to Cloudinary');
    }

    return this.prisma.car.create({
      data: {
        ...createCarDto,
        slug,
      },
    });
  }

  async findAll(startDate?: string, endDate?: string) {
    if (!startDate || !endDate) {
      return this.prisma.car.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find cars that are NOT available (have overlapping bookings)
    const unavailableCars = await this.prisma.booking.findMany({
      where: {
        AND: [
          { status: { not: 'CANCELLED' } },
          {
            OR: [
              {
                AND: [
                  { startDate: { lte: start } },
                  { endDate: { gt: start } },
                ],
              },
              {
                AND: [
                  { startDate: { lt: end } },
                  { endDate: { gte: end } },
                ],
              },
              {
                AND: [
                  { startDate: { gte: start } },
                  { endDate: { lte: end } },
                ],
              },
            ],
          },
        ],
      },
      select: { carId: true },
    });

    const unavailableIds = unavailableCars.map((b: any) => b.carId);

    return this.prisma.car.findMany({
      where: {
        id: { notIn: unavailableIds },
        status: 'AVAILABLE', // Still respect manual maintenance status
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(idOrSlug: string) {
    const car = await this.prisma.car.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      }
    });
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto, file?: Express.Multer.File, galleryFiles?: Express.Multer.File[]) {
    const existing = await this.findOne(id);

    if (file) {
      try {
        const upload = await this.cloudinary.uploadFile(file);
        (updateCarDto as any).imageUrl = upload.secure_url;
      } catch (error) {
        throw new BadRequestException('Failed to upload image to Cloudinary');
      }
    }

    if (galleryFiles && galleryFiles.length > 0) {
      try {
        const galleryUrls = await Promise.all(
          galleryFiles.map(f => this.cloudinary.uploadFile(f).then(res => res.secure_url))
        );
        // Append to existing gallery or replace if provided? 
        // Usually, in these forms, we provide new files to add.
        const currentGallery = existing.gallery || [];
        updateCarDto.gallery = [...currentGallery, ...galleryUrls];
      } catch (error) {
        throw new BadRequestException('Failed to upload gallery images');
      }
    }

    return this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.car.delete({ where: { id } });
  }

  async checkAvailability(id: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        carId: id,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } },
            ],
          },
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    });

    return { available: !overlappingBooking };
  }

  async getBookings(id: string) {
    return this.prisma.booking.findMany({
      where: {
        carId: id,
        status: { not: 'CANCELLED' },
      },
      select: {
        startDate: true,
        endDate: true,
        status: true,
      },
    });
  }
}
