"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminStats() {
        const [totalCars, totalUsers, activeBookings] = await Promise.all([
            this.prisma.vehicle.count(),
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        ]);
        return {
            totalCars,
            totalUsers,
            activeBookings,
            systemStatus: 'Healthy',
        };
    }
    async getUserStats(userId) {
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
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map