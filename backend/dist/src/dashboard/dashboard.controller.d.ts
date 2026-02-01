import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
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
