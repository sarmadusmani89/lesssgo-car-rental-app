import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../booking/entities/booking.entity';
import { EmailService } from '../email/email.service';
import { bookingReminderTemplate } from '../lib/emailTemplates/bookingReminder';

@Injectable()
export class BookingReminderCron {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly emailService: EmailService,
  ) { }

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
      relations: ['user', 'car'],
    });

    for (const booking of bookings) {
      if (!booking.user || !booking.car) continue;

      await this.emailService.sendEmail(
        booking.user.email,
        "Booking Reminder",
        bookingReminderTemplate(
          booking.user.firstName ?? "User",
          booking.car.name ?? "Car",
          new Date(booking.startDate).toDateString()
        )
      );
    }
  }
}
