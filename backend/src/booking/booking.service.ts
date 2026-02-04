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

    // Send email notifications for CASH bookings
    if (createBookingDto.paymentMethod === 'CASH') {
      try {
        const { customerName, customerEmail, car, startDate, endDate, totalAmount } = booking;
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();

        const userHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2563eb;">Booking Confirmed!</h2>
            <p>Hi ${customerName},</p>
            <p>Thank you for choosing <strong>LesssGo</strong>! Your reservation is confirmed.</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Vehicle:</strong> ${car.brand} ${car.name}</p>
              <p><strong>Period:</strong> ${start} to ${end}</p>
              <p><strong>Total Investment:</strong> $${totalAmount}</p>
              <p><strong>Payment Method:</strong> Cash on Pickup</p>
            </div>
            <p>Please bring a valid ID and license during pickup.</p>
          </div>
        `;

        const adminHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2563eb;">New Cash Booking Alert</h2>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Phone:</strong> ${createBookingDto.customerPhone}</p>
              
              <h3>Reservation Details</h3>
              <p><strong>Vehicle:</strong> ${car.brand} ${car.name}</p>
              <p><strong>Period:</strong> ${start} to ${end}</p>
              <p><strong>Total:</strong> $${totalAmount}</p>
            </div>
          </div>
        `;

        const { sendEmail } = await import('../lib/sendEmail');
        await Promise.all([
          sendEmail(customerEmail, 'Booking Confirmation - LesssGo', userHtml),
          sendEmail(process.env.SMTP_USER!, 'New Booking Received', adminHtml)
        ]);
      } catch (err) {
        console.error('Failed to send booking emails:', err);
      }
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
