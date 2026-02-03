import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) { }

  create(createBookingDto: CreateBookingDto) {
    const booking = this.bookingRepo.create(createBookingDto);
    return this.bookingRepo.save(booking);
  }

  findAll() {
    return this.bookingRepo.find({
      relations: ['user', 'car', 'payments'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'car', 'payments'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    Object.assign(booking, updateBookingDto);
    return this.bookingRepo.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    return this.bookingRepo.remove(booking);
  }
}
