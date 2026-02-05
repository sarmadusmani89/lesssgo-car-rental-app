import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { AdminStatsDto, UserStatsDto } from './dto/stats-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getAdminStats(range: string = '6m') {
    const usersCount = await this.prisma.user.count();
    const bookingsCount = await this.prisma.booking.count();

    const payments = await this.prisma.payment.findMany({ where: { status: 'PAID' } });
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

    // Calculate monthly revenue based on range
    let startDate = new Date();
    let monthsBack = 6;

    if (range === '1y') {
      startDate = new Date(new Date().getFullYear(), 0, 1); // Jan 1st of current year
      startDate.setHours(0, 0, 0, 0);
      // Calculate months from Jan to now (0-indexed) + 1
      monthsBack = new Date().getMonth() + 1;
    } else {
      // Last 6 months (rolling)
      startDate.setMonth(startDate.getMonth() - 5); // Go back 5 months to include current month = 6 months total
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    const monthlyPayments = await this.prisma.payment.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        createdAt: true,
      }
    });

    // Group by Month
    const monthlyRevenueMap = new Map<string, number>();

    // Initialize months
    for (let i = 0; i < monthsBack; i++) {
      const d = new Date();
      if (range === '1y') {
        // For this year, start from Jan
        d.setMonth(new Date().getFullYear() === d.getFullYear() ? i : 0); // Logic simpler: just recreate date
        const yearDate = new Date(new Date().getFullYear(), i, 1);
        if (yearDate > new Date()) break; // Don't show future months if logic allows

        const monthYear = yearDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyRevenueMap.set(monthYear, 0);
      } else {
        // For last 6 months, go back from current
        d.setMonth(d.getMonth() - i);
        const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyRevenueMap.set(monthYear, 0);
      }
    }

    // Re-do initialization logic to be cleaner and consistent for both
    monthlyRevenueMap.clear();

    if (range === '1y') {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        const d = new Date(currentYear, i, 1);
        const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyRevenueMap.set(monthYear, 0);
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyRevenueMap.set(monthYear, 0);
      }
    }

    monthlyPayments.forEach((payment: { amount: unknown; createdAt: Date }) => {
      const monthYear = new Date(payment.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (monthlyRevenueMap.has(monthYear)) {
        monthlyRevenueMap.set(monthYear, (monthlyRevenueMap.get(monthYear) || 0) + Number(payment.amount));
      }
    });

    // Convert map to array. Map preserves insertion order, so for '1y' it's Jan->Now. For '6m' it relies on loop order.
    // The previous loop for 6m was: i=5 (oldest) down to 0 (newest).
    // The '1y' loop is i=0 (Jan) to current.
    // So both are ordered oldest to newest.
    const monthlyRevenue = Array.from(monthlyRevenueMap, ([name, total]) => ({ name, total }));

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
