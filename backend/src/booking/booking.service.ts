import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { EmailService } from '../email/email.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly settingsService: SettingsService,
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

    // Auto-confirm CASH bookings
    if (createBookingDto.paymentMethod === 'CASH') {
      createBookingDto.status = 'CONFIRMED';
    }

    const booking = await this.prisma.booking.create({
      data: createBookingDto,
      include: { car: true }
    });

    // Create Payment Record (Essential for Stats)
    await this.prisma.payment.create({
      data: {
        amount: createBookingDto.totalAmount,
        currency: 'AUD', // Default currency
        paymentMethod: createBookingDto.paymentMethod,
        status: createBookingDto.paymentStatus, // Usually PENDING initially
        bookingId: booking.id
      }
    });

    // Send email notifications
    try {
      const settings = await this.settingsService.getSettings();
      const { customerName, customerEmail, customerPhone, car, startDate, endDate, totalAmount } = booking;
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      const paymentMethod = createBookingDto.paymentMethod;

      // Customize message based on payment method
      let paymentStatusMessage = '';
      let emailSubject = '';

      if (paymentMethod === 'CASH') {
        paymentStatusMessage = '<p><strong>Payment Method:</strong> Cash on Pickup</p>';
        emailSubject = 'Booking Confirmed - LesssGo';
      } else {
        // For ONLINE/CARD payments
        paymentStatusMessage = `
          <p><strong>Payment Method:</strong> Online Payment (Stripe)</p>
          <p style="color: #f59e0b;"><strong>Payment Status:</strong> Processing...</p>
          <p style="font-size: 14px; color: #6b7280;">You will receive another email once your payment is confirmed.</p>
        `;
        emailSubject = 'Booking Created - Payment Processing';
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
        vehicleClass: car.vehicleClass,
        pickupLocation: createBookingDto.pickupLocation,
        returnLocation: createBookingDto.returnLocation,
      });

      // Send to User
      await this.emailService.sendEmail(customerEmail, emailSubject, userHtml);

      // Send to Admin ONLY if CASH (Confirmed immediately)
      if (paymentMethod === 'CASH') {
        const { adminBookingNotificationTemplate } = await import('../lib/emailTemplates/adminBookingNotification');
        const adminHtml = adminBookingNotificationTemplate({
          customerName,
          customerEmail,
          customerPhone: customerPhone || 'N/A',
          bookingId: booking.id,
          brand: car.brand,
          vehicleName: car.name,
          startDate: start,
          endDate: end,
          totalAmount,
          paymentMethod,
          paymentStatus: 'Confirmed (Cash)',
          hp: car.hp,
          vehicleClass: car.vehicleClass,
          pickupLocation: createBookingDto.pickupLocation,
          returnLocation: createBookingDto.returnLocation,
        });

        await this.emailService.sendEmail(settings.adminEmail, 'New Booking Alert - Cash Payment', adminHtml);
      }

      console.log('Booking emails processed successfully');
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
      include: {
        car: true,
        user: true,
        payments: true,
      }
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

    // Check for existing payment
    const existingPayment = await this.prisma.payment.findFirst({
      where: { bookingId: id }
    });

    if (existingPayment) {
      // Update existing
      await this.prisma.payment.update({
        where: { id: existingPayment.id },
        data: { status: 'PAID' }
      });
    } else {
      // Create missing payment record (Backfill)
      await this.prisma.payment.create({
        data: {
          bookingId: id,
          currency: 'AUD', // Default currency
          amount: updatedBooking.totalAmount,
          paymentMethod: updatedBooking.paymentMethod,
          status: 'PAID'
        }
      });
    }

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
        airConditioner: booking.car.airConditioner,
        gps: booking.car.gps,
        vehicleClass: booking.car.vehicleClass,
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
      });

      await this.emailService.sendEmail(customerEmail, 'Payment Confirmed - LesssGo', userHtml);

      // Send to Admin (Confirmed)
      const settings = await this.settingsService.getSettings();
      const { adminBookingNotificationTemplate } = await import('../lib/emailTemplates/adminBookingNotification');
      const adminHtml = adminBookingNotificationTemplate({
        customerName,
        customerEmail,
        customerPhone: updatedBooking.customerPhone || 'N/A',
        bookingId: updatedBooking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        paymentMethod,
        paymentStatus: 'Confirmed (Online)',
        hp: car.hp,
        vehicleClass: car.vehicleClass,
      });

      await this.emailService.sendEmail(settings.adminEmail, 'New Booking Alert - Payment Received', adminHtml);

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
