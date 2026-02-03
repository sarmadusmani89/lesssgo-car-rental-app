import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('user/:userId')
  getUserStats(@Param('userId') userId: string) {
    return this.dashboardService.getUserStats(Number(userId));
  }
}
