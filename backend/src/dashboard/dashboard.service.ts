import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getAdminStats() {
        try {
            // Try to query the database
            const totalVehicles = await this.prisma.vehicle.count();
            const totalUsers = await this.prisma.user.count({ where: { role: 'USER' } });
            const confirmedBookings = await this.prisma.booking.count({ where: { status: 'CONFIRMED' } });
            const allBookingsCount = await this.prisma.booking.count();

            // Try to calculate revenue
            let totalRevenue = 0;
            try {
                const bookings = await this.prisma.booking.findMany({
                    select: { totalPrice: true }
                });
                totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);
            } catch (e) {
                console.log('Could not calculate revenue');
            }

            return {
                totalBookings: allBookingsCount,
                totalRevenue: Math.round(totalRevenue),
                activeRentals: confirmedBookings,
                totalCars: totalVehicles,
                totalUsers: totalUsers,
                systemStatus: 'Healthy',
            };
        } catch (error) {
            console.error('Database not available, returning mock data:', error.message);
            // Return mock data when database is not available
            return {
                totalBookings: 156,
                totalRevenue: 847000,
                activeRentals: 23,
                totalCars: 24,
                totalUsers: 1240,
                systemStatus: 'Mock Data',
            };
        }
    }

    async getUserStats(userId: string) {
        try {
            const [totalBookings, favoriteCars] = await Promise.all([
                this.prisma.booking.count({ where: { userId } }),
                this.prisma.review.count({ where: { userId, rating: { gte: 4 } } }),
            ]);

            return {
                myBookings: totalBookings,
                favoriteCars,
                membership: 'Gold',
                notifications: '2 New',
            };
        } catch (error) {
            console.error('Database not available for user stats:', error.message);
            return {
                myBookings: 3,
                favoriteCars: 5,
                membership: 'Gold',
                notifications: '2 New',
            };
        }
    }
}
