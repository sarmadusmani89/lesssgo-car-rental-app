"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingReminders = sendBookingReminders;
const prisma_service_1 = require("../prisma/prisma.service");
const booking_service_1 = require("../services/booking.service");
const sendEmail_1 = require("../lib/sendEmail");
const bookingReminder_1 = require("../lib/emailTemplates/bookingReminder");
const prisma = new prisma_service_1.PrismaService();
const bookingService = new booking_service_1.BookingService(prisma);
async function sendBookingReminders() {
    const bookings = await bookingService.getTomorrowBookings();
    for (const booking of bookings) {
        if (!booking.user || !booking.vehicle)
            continue;
        await (0, sendEmail_1.sendEmail)(booking.user.email, "Booking Reminder", (0, bookingReminder_1.bookingReminderTemplate)(booking.user.name ?? "User", booking.vehicle.name ?? "Vehicle", booking.startDate.toDateString()));
    }
}
// Call manually if needed
// sendBookingReminders();
//# sourceMappingURL=bookingReminder.cron.js.map