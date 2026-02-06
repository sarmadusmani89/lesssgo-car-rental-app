import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) { }

  async create(createBookingDto: CreateBookingDto) {
    const { carId, startDate, endDate } = createBookingDto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const overlappingBooking = await this.prisma.booking.findFirst({
      where: {
        carId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gt: start } },
            ],
          },
          {
            AND: [
              { startDate: { lt: end } },
              { endDate: { gte: end } },
            ],
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      throw new ConflictException('Car is already booked for the selected dates');
    }

    const booking = await this.prisma.booking.create({
      data: createBookingDto,
      include: { car: true }
    });

    // Send email notifications for ALL bookings
    try {
      const { customerName, customerEmail, car, startDate, endDate, totalAmount } = booking;
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      const paymentMethod = createBookingDto.paymentMethod;

      // Customize message based on payment method
      let paymentStatusMessage = '';
      let emailSubject = '';
      let adminEmailSubject = '';

      if (paymentMethod === 'CASH') {
        paymentStatusMessage = '<p><strong>Payment Method:</strong> Cash on Pickup</p>';
        emailSubject = 'Booking Confirmed - LesssGo';
        adminEmailSubject = 'New Cash Booking Alert';
      } else {
        // For ONLINE/CARD payments
        paymentStatusMessage = `
          <p><strong>Payment Method:</strong> Online Payment (Stripe)</p>
          <p style="color: #f59e0b;"><strong>Payment Status:</strong> Processing...</p>
          <p style="font-size: 14px; color: #6b7280;">You will receive another email once your payment is confirmed.</p>
        `;
        emailSubject = 'Booking Created - Payment Processing';
        adminEmailSubject = 'New Online Booking - Payment Pending';
      }

      const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');

      const userHtml = bookingConfirmationTemplate({
        customerName,
        bookingId: booking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        paymentMethod,
        isConfirmed: paymentMethod === 'CASH', // Cash is immediately confirmed
        hp: car.hp,
        passengers: car.passengers,
        fuelType: car.fuelType,
        transmission: car.transmission,
        airConditioner: car.airConditioner,
        gps: car.gps,
      });

      const adminHtml = bookingConfirmationTemplate({
        customerName: 'Admin',
        bookingId: booking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        paymentMethod,
        isConfirmed: paymentMethod === 'CASH',
        hp: car.hp,
        passengers: car.passengers,
        fuelType: car.fuelType,
        transmission: car.transmission,
        airConditioner: car.airConditioner,
        gps: car.gps,
      });

      console.log(`Sending booking confirmation emails for ${paymentMethod} payment...`);
      await Promise.all([
        this.emailService.sendEmail(customerEmail, emailSubject, userHtml),
        this.emailService.sendEmail(process.env.SMTP_USER!, adminEmailSubject, adminHtml)
      ]);
      console.log('Booking confirmation emails sent successfully');
    } catch (err) {
      console.error('Failed to send booking emails:', err);
    }

    return booking;
  }

  findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: true,
        car: true,
        payments: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        car: true,
        payments: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto as any,
    });
  }

  async confirmPayment(id: string) {
    const booking = await this.findOne(id);

    // Update booking payment status
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      },
      include: { car: true }
    });

    // Also update associated payment records
    await this.prisma.payment.updateMany({
      where: { bookingId: id },
      data: { status: 'PAID' }
    });

    // Send confirmation email if it was previously PENDING
    try {
      const { customerName, customerEmail, car, startDate, endDate, totalAmount, paymentMethod } = updatedBooking;
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();

      const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');

      const userHtml = bookingConfirmationTemplate({
        customerName,
        bookingId: updatedBooking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        paymentMethod,
        isConfirmed: true,
        hp: car.hp,
        passengers: car.passengers,
        fuelType: car.fuelType,
        transmission: car.transmission,
        airConditioner: car.airConditioner,
        gps: car.gps,
      });

      await this.emailService.sendEmail(customerEmail, 'Payment Confirmed - LesssGo', userHtml);
    } catch (err) {
      console.error('Failed to send payment confirmation email:', err);
    }

    return updatedBooking;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        user: true,
        car: true,
        payments: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findByCar(carId: string) {
    return this.prisma.booking.findMany({
      where: {
        carId,
        status: { not: 'CANCELLED' }
      },
      select: {
        startDate: true,
        endDate: true
      }
    });
  }
}
