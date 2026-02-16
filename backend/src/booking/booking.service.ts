import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingValidationService } from './services/booking.validation.service';
import { BookingEmailService } from './services/booking.email.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: BookingValidationService,
    private readonly emailService: BookingEmailService,
  ) { }

  async create(createBookingDto: CreateBookingDto) {
    const { carId, startDate, endDate, customerName, customerPhone } = createBookingDto;

    await this.validationService.validateDuration(startDate, endDate);

    const booking = await this.prisma.$transaction(async (tx) => {
      await this.validationService.checkAvailability(carId, startDate, endDate);
      const car = await this.validationService.validateCarExists(carId);

      const bondAmount = car.pricePerDay;

      // Auto-confirm CASH bookings
      if (createBookingDto.paymentMethod === 'CASH') {
        createBookingDto.status = 'CONFIRMED';
        (createBookingDto as any).confirmedAt = new Date();
      }

      const { customerName: _n, customerEmail: _e, customerPhone: _p, ...bookingData } = createBookingDto;

      return tx.booking.create({
        data: {
          ...bookingData,
          customerName,
          customerEmail: createBookingDto.customerEmail,
          customerPhone,
          bondAmount,
          bondStatus: 'PENDING'
        },
        include: { car: true, user: true }
      });
    });

    // Profile & Payment Sync
    try {
      await Promise.all([
        this.prisma.user.update({
          where: { id: createBookingDto.userId },
          data: { name: customerName, phoneNumber: customerPhone }
        }),
        this.prisma.payment.create({
          data: {
            amount: createBookingDto.totalAmount + booking.bondAmount,
            currency: 'PGK',
            paymentMethod: createBookingDto.paymentMethod,
            status: createBookingDto.paymentStatus,
            bookingId: booking.id
          }
        })
      ]);
    } catch (err) {
      console.warn('Post-booking sync failed:', err);
    }

    await this.emailService.sendBookingReceived(booking);
    return booking;
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: { user: true, car: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, car: true, payments: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    const now = new Date();

    const {
      status, paymentStatus, startDate, endDate, totalAmount, bondAmount,
      bondStatus, paymentMethod, customerName, customerEmail, customerPhone,
      pickupLocation, returnLocation
    } = updateBookingDto;

    const data: any = {};
    if (status !== undefined) data.status = status;
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;
    if (totalAmount !== undefined) data.totalAmount = totalAmount;
    if (bondAmount !== undefined) data.bondAmount = bondAmount;
    if (bondStatus !== undefined) data.bondStatus = bondStatus;
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    if (customerName !== undefined) data.customerName = customerName;
    if (customerEmail !== undefined) data.customerEmail = customerEmail;
    if (customerPhone !== undefined) data.customerPhone = customerPhone;
    if (pickupLocation !== undefined) data.pickupLocation = pickupLocation;
    if (returnLocation !== undefined) data.returnLocation = returnLocation;

    if (startDate) {
      data.startDate = new Date(startDate);
      await this.validationService.checkAvailability(booking.carId, data.startDate, data.endDate || booking.endDate, id);
    }
    if (endDate) {
      data.endDate = new Date(endDate);
      await this.validationService.checkAvailability(booking.carId, data.startDate || booking.startDate, data.endDate, id);
    }

    if (status === 'CONFIRMED' && booking.status !== 'CONFIRMED') data.confirmedAt = now;
    if (status === 'CANCELLED' && booking.status !== 'CANCELLED') data.cancelledAt = now;
    if (status === 'COMPLETED' && booking.status !== 'COMPLETED') data.completedAt = now;
    if (paymentStatus === 'PAID' && booking.paymentStatus !== 'PAID') data.paidAt = now;

    const updated = await this.prisma.booking.update({
      where: { id },
      data,
      include: { car: true, user: true, payments: true }
    });

    if (status === 'CONFIRMED' && booking.status !== 'CONFIRMED') {
      await this.emailService.sendConfirmationEmail(updated);
    } else if (status === 'CANCELLED' && booking.status !== 'CANCELLED') {
      await this.emailService.sendCancellationEmail(updated);
    }

    return updated;
  }

  async confirmPayment(id: string) {
    const booking = await this.findOne(id);

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        bondStatus: 'PAID',
        status: 'CONFIRMED',
        paidAt: new Date(),
        confirmedAt: (booking as any).confirmedAt || new Date()
      },
      include: { car: true, user: true }
    });

    const existingPayment = await this.prisma.payment.findFirst({ where: { bookingId: id } });

    if (existingPayment) {
      await this.prisma.payment.update({
        where: { id: existingPayment.id },
        data: { status: 'PAID', currency: 'PGK' }
      });
    } else {
      await this.prisma.payment.create({
        data: {
          bookingId: id,
          currency: 'PGK',
          amount: updatedBooking.totalAmount + updatedBooking.bondAmount,
          paymentMethod: updatedBooking.paymentMethod,
          status: 'PAID'
        }
      });
    }

    await this.emailService.sendPaymentConfirmation(updatedBooking);
    return updatedBooking;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { user: true, car: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCar(carId: string) {
    return this.prisma.booking.findMany({
      where: {
        carId,
        status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] }
      },
      select: { startDate: true, endDate: true }
    });
  }

  async findBySessionId(sessionId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripeSessionId: sessionId },
      include: { booking: { include: { car: true } } }
    });

    if (!payment || !payment.booking) {
      throw new NotFoundException('Booking not found for this session');
    }

    return payment.booking;
  }
}
