import { Module } from '@nestjs/common';
import { BookingReminderCron } from './bookingReminder.cron';
import { EmailModule } from '../email/email.module';
@Module({
    imports: [
        EmailModule,
    ],
    providers: [BookingReminderCron],
})
export class CronModule { }
