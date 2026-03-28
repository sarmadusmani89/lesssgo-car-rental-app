import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';
import { StripeService } from './stripe.service';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [ConfigModule, EmailModule, SettingsModule, BookingModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
  exports: [PaymentService, StripeService],
})
export class PaymentModule { }
