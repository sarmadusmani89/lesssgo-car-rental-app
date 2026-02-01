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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let BookingService = class BookingService {
    prisma;
    emailService;
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async findAll() {
        return this.prisma.booking.findMany({
            include: { user: true, vehicle: true },
        });
    }
    async findByUserId(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { vehicle: true },
        });
    }
    async create(data) {
        const booking = await this.prisma.booking.create({
            data,
            include: { user: true, vehicle: true },
        });
        if (booking.user?.email) {
            await this.emailService.sendBookingConfirmation(booking.user.email, {
                vehicleName: booking.vehicle.name,
                startDate: booking.startDate.toDateString(),
                endDate: booking.endDate.toDateString(),
                totalPrice: booking.totalPrice,
            });
        }
        return booking;
    }
    async update(id, data) {
        return this.prisma.booking.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.booking.delete({ where: { id } });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], BookingService);
//# sourceMappingURL=booking.service.js.map