import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../lib/prisma.service';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [EmailModule, SettingsModule],
  controllers: [BookingController],
  providers: [BookingService, PrismaService],
  exports: [BookingService],
})
export class BookingModule { }
