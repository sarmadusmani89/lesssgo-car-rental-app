import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../lib/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';
import { KinaHmacService } from './kina-hmac.service';
import { BookingModule } from '../booking/booking.module';
import { KinaCallbackThrottlerGuard } from './kina-callback-throttler.guard';

@Module({
  imports: [ConfigModule, EmailModule, SettingsModule, BookingModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, KinaHmacService, KinaCallbackThrottlerGuard],
  exports: [PaymentService, KinaHmacService],
})
export class PaymentModule { }
