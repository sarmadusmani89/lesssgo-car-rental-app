import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../lib/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [ConfigModule, EmailModule, SettingsModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
  exports: [PaymentService],
})
export class PaymentModule { }
