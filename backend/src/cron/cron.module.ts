import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingReminderCron } from './bookingReminder.cron';
import { Booking } from '../booking/entities/booking.entity';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking]),
        EmailModule,
    ],
    providers: [BookingReminderCron],
})
export class CronModule { }
