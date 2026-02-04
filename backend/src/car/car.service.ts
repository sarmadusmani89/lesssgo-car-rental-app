import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) { }

  create(createCarDto: CreateCarDto) {
    return this.prisma.car.create({
      data: createCarDto,
    });
  }

  async findAll(startDate?: string, endDate?: string) {
    if (!startDate || !endDate) {
      return this.prisma.car.findMany();
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
    });
  }

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({ where: { id } });
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto) {
    await this.findOne(id);
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
