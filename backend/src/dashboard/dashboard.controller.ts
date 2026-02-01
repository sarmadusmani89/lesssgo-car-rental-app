import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('admin')
    @ApiOperation({ summary: 'Get stats for admin dashboard' })
    async getAdminStats() {
        return this.dashboardService.getAdminStats();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get stats for user dashboard' })
    async getUserStats(@Param('userId') userId: string) {
        return this.dashboardService.getUserStats(userId);
    }
}
