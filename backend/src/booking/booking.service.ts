import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class BookingService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    async findAll() {
        return this.prisma.booking.findMany({
            include: { user: true, vehicle: true },
        });
    }

    async findByUserId(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { vehicle: true },
        });
    }

    async create(data: any) {
        const booking = await this.prisma.booking.create({
            data,
            include: { user: true, vehicle: true },
        });

        if (booking.user?.email) {
            await this.emailService.sendBookingConfirmation(booking.user.email, {
                vehicleName: booking.vehicle.name,
                startDate: booking.startDate.toDateString(),
                endDate: booking.endDate.toDateString(),
                totalPrice: booking.totalPrice,
            });
        }

        return booking;
    }

    async update(id: string, data: any) {
        return this.prisma.booking.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.booking.delete({ where: { id } });
    }
}
