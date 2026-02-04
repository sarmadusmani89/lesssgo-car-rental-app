import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { AdminStatsDto, UserStatsDto } from './dto/stats-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getAdminStats() {
    const usersCount = await this.prisma.user.count();
    const bookingsCount = await this.prisma.booking.count();

    const payments = await this.prisma.payment.findMany();
    const revenueOverall = payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0);

    const availableCars = await this.prisma.car.count({ where: { status: 'AVAILABLE' } });
    const rentedCars = await this.prisma.car.count({ where: { status: 'RENTED' } });

    const recentBookings = await this.prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        car: true,
      }
    });

    return {
      users: usersCount,
      bookings: bookingsCount,
      revenue: revenueOverall,
      availableCars,
      rentedCars,
      recentBookings,
    };
  }

  async getUserStats(userId: string): Promise<UserStatsDto> {
    const bookings = await this.prisma.booking.findMany({ where: { userId } });
    const totalSpent = bookings.reduce((acc: number, b: any) => acc + Number(b.totalAmount), 0);

    return {
      userId, // Use the string userId passed to the function
      bookings: bookings.length,
      totalSpent,
    };
  }
}
