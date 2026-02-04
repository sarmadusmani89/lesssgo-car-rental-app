import { Module } from '@nestjs/common';
import { BookingReminderCron } from './bookingReminder.cron';
import { EmailModule } from '../email/email.module';
import { PrismaService } from '../lib/prisma.service';

@Module({
    imports: [
        EmailModule,
    ],
    providers: [BookingReminderCron, PrismaService],
})
export class CronModule { }
