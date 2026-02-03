import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) { }

  async getAdminStats() {
    const usersCount = await this.userRepo.count();
    const bookingsCount = await this.bookingRepo.count();
    const payments = await this.paymentRepo.find();
    const revenue = payments.reduce((acc: number, p: Payment) => acc + Number(p.amount), 0);

    return {
      users: usersCount,
      bookings: bookingsCount,
      revenue,
    };
  }

  async getUserStats(userId: number) {
    const bookings = await this.bookingRepo.find({ where: { userId } });
    const totalSpent = bookings.reduce((acc: number, b: Booking) => acc + Number(b.totalAmount), 0);

    return {
      userId,
      bookings: bookings.length,
      totalSpent,
    };
  }
}
