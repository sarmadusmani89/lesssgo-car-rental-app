import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { AdminStatsDto, UserStatsDto } from './dto/stats-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getAdminStats(range: string = '6m') {
    try {
      console.log('--- getAdminStats START ---');
      console.log('Range:', range);

      console.log('Querying User count...');
      const usersCount = await this.prisma.user.count();
      console.log('User count:', usersCount);

      console.log('Querying Booking count...');
      const bookingsCount = await this.prisma.booking.count();
      console.log('Booking count:', bookingsCount);

      console.log('Querying Payments (status: PAID)...');
      const payments = await this.prisma.payment.findMany({ where: { status: 'PAID' } });
      console.log('Found payments:', payments.length);

      const revenueOverall = payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0);
      console.log('Revenue overall:', revenueOverall);

      console.log('Querying available cars stats...');
      const availableCars = await this.prisma.car.count({ where: { status: 'AVAILABLE' } });
      const rentedCars = await this.prisma.car.count({ where: { status: 'RENTED' } });
      console.log('Available:', availableCars, 'Rented:', rentedCars);

      console.log('Querying recent bookings...');
      const recentBookings = await this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          car: true,
        }
      });
      console.log('Recent bookings count:', recentBookings.length);

      // Date logic
      console.log('Determining start date for range...');
      let startDate = new Date();
      if (range === '1y') {
        startDate = new Date(new Date().getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate.setDate(1);
        startDate.setMonth(startDate.getMonth() - 5);
        startDate.setHours(0, 0, 0, 0);
      }
      console.log('Start date:', startDate);

      console.log('Querying monthly payments...');
      const monthlyPayments = await this.prisma.payment.findMany({
        where: {
          status: 'PAID',
          createdAt: { gte: startDate },
        },
        select: {
          amount: true,
          createdAt: true,
        }
      });
      console.log('Monthly payments found:', monthlyPayments.length);

      const monthlyRevenueMap = new Map<string, number>();
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
          d.setDate(1);
          d.setMonth(d.getMonth() - i);
          const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
          monthlyRevenueMap.set(monthYear, 0);
        }
      }
      console.log('Revenue maps initialized:', monthlyRevenueMap.size);

      monthlyPayments.forEach((payment: any) => {
        const monthYear = new Date(payment.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyRevenueMap.has(monthYear)) {
          monthlyRevenueMap.set(monthYear, (monthlyRevenueMap.get(monthYear) || 0) + Number(payment.amount));
        }
      });

      const monthlyRevenue = Array.from(monthlyRevenueMap, ([name, total]) => ({ name, total }));
      console.log('Monthly revenue array size:', monthlyRevenue.length);

      console.log('--- getAdminStats SUCCESS ---');
      return {
        users: usersCount,
        bookings: bookingsCount,
        revenue: revenueOverall,
        availableCars,
        rentedCars,
        recentBookings,
        monthlyRevenue,
      };
    } catch (error: any) {
      console.error('--- getAdminStats FATAL ERROR ---');
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<UserStatsDto> {
    const bookings = await this.prisma.booking.findMany({ where: { userId } });
    const totalSpent = bookings.reduce((acc: number, b: any) => {
      if (b.paymentStatus === 'PAID') {
        return acc + Number(b.totalAmount);
      }
      return acc;
    }, 0);

    return {
      userId, // Use the string userId passed to the function
      bookings: bookings.length,
      totalSpent,
    };
  }
}
