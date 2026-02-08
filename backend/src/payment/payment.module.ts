import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../lib/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';
import { StripeService } from './stripe.service';

@Module({
  imports: [ConfigModule, EmailModule, SettingsModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, StripeService],
  exports: [PaymentService, StripeService],
})
export class PaymentModule { }
