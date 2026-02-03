import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) { }

  create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepo.create(createPaymentDto);
    return this.paymentRepo.save(payment);
  }

  findAll() {
    return this.paymentRepo.find({
      relations: ['booking', 'booking.user', 'booking.car'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['booking', 'booking.user', 'booking.car'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepo.save(payment);
  }

  async remove(id: number) {
    const payment = await this.findOne(id);
    return this.paymentRepo.remove(payment);
  }
}
