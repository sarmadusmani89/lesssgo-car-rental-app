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

    // Calculate monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start from the 1st of that month

    const monthlyPayments = await this.prisma.payment.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      }
    });

    // Group by Month
    const monthlyRevenueMap = new Map<string, number>();

    // Initialize last 6 months with 0
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jan 2026"
      monthlyRevenueMap.set(monthYear, 0);
    }

    monthlyPayments.forEach(payment => {
      const monthYear = new Date(payment.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (monthlyRevenueMap.has(monthYear)) {
        monthlyRevenueMap.set(monthYear, (monthlyRevenueMap.get(monthYear) || 0) + Number(payment.amount));
      }
    });

    // Convert map to array and reverse to show oldest to newest
    const monthlyRevenue = Array.from(monthlyRevenueMap, ([name, total]) => ({ name, total })).reverse();

    return {
      users: usersCount,
      bookings: bookingsCount,
      revenue: revenueOverall,
      availableCars,
      rentedCars,
      recentBookings,
      monthlyRevenue,
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
