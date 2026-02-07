import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { EmailService } from '../email/email.service';
import { bookingReminderTemplate } from '../lib/emailTemplates/bookingReminder';

@Injectable()
export class BookingReminderCron {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  async sendBookingReminders() {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        startDate: {
          gte: start,
          lte: end,
        },
        status: 'CONFIRMED'
      },
      include: {
        user: true,
        car: true,
      },
    });

    for (const booking of bookings) {
      if (!booking.user || !booking.car) continue;

      await this.emailService.sendEmail(
        booking.user.email,
        "Booking Reminder",
        bookingReminderTemplate({
          userName: booking.user.name ?? "User",
          carName: booking.car.name ?? "Car",
          brand: booking.car.brand ?? "Vehicle",
          startDate: new Date(booking.startDate).toLocaleString('en-AU', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          }),
          pickupLocation: booking.pickupLocation || 'Not specified',
          bookingId: booking.id
        })
      );
    }
  }
}
