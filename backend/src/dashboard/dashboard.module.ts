import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../user/entities/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Booking, Payment])],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule { }
