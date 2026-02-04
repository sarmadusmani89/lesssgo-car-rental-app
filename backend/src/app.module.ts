import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CarModule } from './car/car.module';
import { PaymentModule } from './payment/payment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmailModule } from './email/email.module';
import { CronModule } from './cron/cron.module';
import { ContactModule } from './contact/contact.module';
import { PrismaService } from './lib/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    BookingModule,
    CarModule,
    PaymentModule,
    DashboardModule,
    EmailModule,
    CronModule,
    ContactModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule { }
