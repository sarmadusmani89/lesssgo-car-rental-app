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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingReminderCron = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../booking/entities/booking.entity");
const email_service_1 = require("../email/email.service");
const bookingReminder_1 = require("../lib/emailTemplates/bookingReminder");
let BookingReminderCron = class BookingReminderCron {
    constructor(bookingRepo, emailService) {
        this.bookingRepo = bookingRepo;
        this.emailService = emailService;
    }
    async sendBookingReminders() {
        const start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        const bookings = await this.bookingRepo.find({
            where: {
                startDate: start.toISOString().split('T')[0], // Assuming date string format from entity
                status: 'confirmed'
            },
            relations: ['user', 'vehicle'],
        });
        for (const booking of bookings) {
            if (!booking.user || !booking.vehicle)
                continue;
            await this.emailService.sendEmail(booking.user.email, "Booking Reminder", (0, bookingReminder_1.bookingReminderTemplate)(booking.user.firstName ?? "User", booking.vehicle.name ?? "Vehicle", new Date(booking.startDate).toDateString()));
        }
    }
};
exports.BookingReminderCron = BookingReminderCron;
exports.BookingReminderCron = BookingReminderCron = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService])
], BookingReminderCron);
//# sourceMappingURL=bookingReminder.cron.js.map