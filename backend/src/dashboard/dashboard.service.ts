import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getAdminStats() {
    return {
      users: 0,
      bookings: 0,
      revenue: 0,
    };
  }

  async getUserStats(userId: number) {
    return {
      userId,
      bookings: 0,
      totalSpent: 0,
    };
  }
}
