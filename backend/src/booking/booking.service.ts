import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) { }

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

      const userHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">Booking ${paymentMethod === 'CASH' ? 'Confirmed' : 'Created'}!</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for choosing <strong>LesssGo</strong>! ${paymentMethod === 'CASH' ? 'Your reservation is confirmed.' : 'We have received your booking request.'}</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Vehicle:</strong> ${car.brand} ${car.name}</p>
            <p><strong>Period:</strong> ${start} to ${end}</p>
            <p><strong>Total Amount:</strong> $${totalAmount}</p>
            ${paymentStatusMessage}
          </div>
          ${paymentMethod === 'CASH' ? '<p>Please bring a valid ID and license during pickup.</p>' : '<p>Please complete your payment to confirm this booking.</p>'}
        </div>
      `;

      const adminHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">${adminEmailSubject}</h2>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${createBookingDto.customerPhone}</p>
            
            <h3>Reservation Details</h3>
            <p><strong>Vehicle:</strong> ${car.brand} ${car.name}</p>
            <p><strong>Period:</strong> ${start} to ${end}</p>
            <p><strong>Total:</strong> $${totalAmount}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
          </div>
        </div>
      `;

      const { sendEmail } = await import('../lib/sendEmail');
      console.log(`Sending booking confirmation emails for ${paymentMethod} payment...`);
      await Promise.all([
        sendEmail(customerEmail, emailSubject, userHtml),
        sendEmail(process.env.SMTP_USER!, adminEmailSubject, adminHtml)
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
}
