import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class BookingValidationService {
    constructor(private readonly prisma: PrismaService) { }

    async validateDuration(startDate: string | Date, endDate: string | Date) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        if (durationHours < 48) {
            throw new BadRequestException('Minimum booking duration is 48 hours.');
        }
    }

    async checkAvailability(carId: string, startDate: string | Date, endDate: string | Date, excludeBookingId?: string) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const overlappingBooking = await this.prisma.booking.findFirst({
            where: {
                carId,
                id: excludeBookingId ? { not: excludeBookingId } : undefined,
                status: {
                    in: ['PENDING', 'CONFIRMED', 'COMPLETED']
                },
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

        if (overlappingBooking) {
            throw new ConflictException('Car is already booked for the selected dates');
        }
    }

    async validateCarExists(carId: string) {
        const car = await this.prisma.car.findUnique({ where: { id: carId } });
        if (!car) throw new NotFoundException('Car not found');
        return car;
    }
}
