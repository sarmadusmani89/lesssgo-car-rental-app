import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../lib/prisma.service';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';
import { BookingEmailService } from './services/booking.email.service';
import { BookingValidationService } from './services/booking.validation.service';

@Module({
  imports: [EmailModule, SettingsModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    PrismaService,
    BookingEmailService,
    BookingValidationService
  ],
  exports: [BookingService],
})
export class BookingModule { }
