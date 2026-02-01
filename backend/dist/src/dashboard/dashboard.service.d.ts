import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminStats(): Promise<{
        totalCars: number;
        totalUsers: number;
        activeBookings: number;
        systemStatus: string;
    }>;
    getUserStats(userId: string): Promise<{
        myBookings: number;
        favoriteCars: number;
        membership: string;
        notifications: string;
    }>;
}
