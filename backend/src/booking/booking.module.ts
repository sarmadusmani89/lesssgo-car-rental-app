import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';
import { BookingEmailService } from './services/booking.email.service';
import { BookingValidationService } from './services/booking.validation.service';

@Module({
  imports: [EmailModule, SettingsModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingEmailService,
    BookingValidationService
  ],
  exports: [BookingService, BookingEmailService, BookingValidationService],
})
export class BookingModule { }
