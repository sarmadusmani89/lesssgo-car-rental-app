import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('admin')
  getAdminStats(@Query('range') range: string) {
    return this.dashboardService.getAdminStats(range);
  }

  @Get('user/:userId')
  getUserStats(@Param('userId') userId: string) {
    return this.dashboardService.getUserStats(userId);
  }
}
