import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
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
    const { carId, startDate, endDate, customerName, customerEmail, customerPhone } = createBookingDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Enforce minimum 48-hour duration
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 48) {
      throw new BadRequestException('Minimum booking duration is 48 hours.');
    }

    // Use a transaction to prevent race conditions
    const booking = await this.prisma.$transaction(async (tx) => {

      // Check for overlapping bookings - only CANCELLED bookings should NOT block
      const overlappingBooking = await tx.booking.findFirst({
        where: {
          carId,
          status: {
            in: ['PENDING', 'CONFIRMED', 'COMPLETED'] // All these statuses block new bookings
          },
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

      const car = await tx.car.findUnique({ where: { id: carId } });
      if (!car) throw new NotFoundException('Car not found');

      const bondAmount = car.pricePerDay;

      // Auto-confirm CASH bookings
      if (createBookingDto.paymentMethod === 'CASH') {
        createBookingDto.status = 'CONFIRMED';
      }

      const { customerName: _customerName, customerEmail: _customerEmail, customerPhone: _customerPhone, ...bookingData } = createBookingDto;

      const newBooking = await tx.booking.create({
        data: {
          ...bookingData,
          customerName,
          customerEmail,
          customerPhone,
          bondAmount,
          bondStatus: 'PENDING'
        },
        include: { car: true, user: true }
      });

      return newBooking;
    });

    // Sync User Profile (Name and Phone)
    try {
      await this.prisma.user.update({
        where: { id: createBookingDto.userId },
        data: {
          name: customerName,
          phoneNumber: customerPhone
        }
      });
    } catch (err) {
      console.warn('Failed to sync user profile during booking:', err);
    }

    // Create Payment Record (Essential for Stats)
    await this.prisma.payment.create({
      data: {
        amount: createBookingDto.totalAmount + booking.bondAmount,
        currency: 'PGK',
        paymentMethod: createBookingDto.paymentMethod,
        status: createBookingDto.paymentStatus, // Usually PENDING initially
        bookingId: booking.id
      }
    });

    // Send email notifications
    try {
      const settings = await this.settingsService.getSettings();
      const bookingWithRelations = booking as any;
      const { car, startDate, endDate, totalAmount } = bookingWithRelations;

      // Prioritize customerName from DTO over user profile name
      const bCustomerName = customerName || 'Valued Customer';
      const bCustomerEmail = customerEmail;
      const bCustomerPhone = customerPhone || 'N/A';
      const formatOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      };
      const start = new Date(startDate).toLocaleString('en-AU', formatOptions);
      const end = new Date(endDate).toLocaleString('en-AU', formatOptions);
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
        emailSubject = 'Booking Received - Awaiting Payment - LesssGo';
      }

      const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');

      const userHtml = bookingConfirmationTemplate({
        customerName: bCustomerName,
        bookingId: booking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        bondAmount: booking.bondAmount,
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
        customTitle: paymentMethod === 'CASH' ? 'Booking Confirmed' : 'Booking Received',
        customDescription: paymentMethod === 'CASH'
          ? 'Great news! Your booking is officially confirmed and your vehicle is reserved.'
          : 'We have received your booking request. Please complete the payment to secure your reservation.',
        paymentStatus: paymentMethod === 'CASH' ? 'To be Paid' : 'Awaiting Payment'
      });

      // Send to User
      await this.emailService.sendEmail(bCustomerEmail, emailSubject, userHtml);

      // Send to Admin ONLY if CASH (Confirmed immediately)
      if (paymentMethod === 'CASH') {
        const { adminBookingNotificationTemplate } = await import('../lib/emailTemplates/adminBookingNotification');
        const adminHtml = adminBookingNotificationTemplate({
          customerName: bCustomerName,
          customerEmail: bCustomerEmail,
          customerPhone: bCustomerPhone || 'N/A',
          bookingId: booking.id,
          brand: car.brand,
          vehicleName: car.name,
          startDate: start,
          endDate: end,
          totalAmount,
          bondAmount: booking.bondAmount,
          paymentMethod,
          paymentStatus: 'Pending (Cash on Pickup)',
          hp: car.hp,
          vehicleClass: car.vehicleClass,
          transmission: car.transmission,
          fuelType: car.fuelType,
          pickupLocation: createBookingDto.pickupLocation,
          returnLocation: createBookingDto.returnLocation,
          customTitle: 'New Cash Booking',
          customDescription: 'A new booking has been placed with <strong>Cash on Pickup</strong>. The booking is confirmed, but payment is pending.',
          isPaid: false
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
    const updated = await this.prisma.booking.update({
      where: { id },
      data: updateBookingDto as any,
      include: {
        car: true,
        user: true,
        payments: true,
      }
    });

    // Send Confirmation Email if status changed to CONFIRMED
    if (updateBookingDto.status === 'CONFIRMED' && booking.status !== 'CONFIRMED') {
      try {
        const { car, startDate, endDate, totalAmount, paymentMethod, customerName: snapName, customerEmail: snapEmail } = updated;
        const customerNameFinal = snapName || updated.user?.name || 'Valued Customer';
        const customerEmailFinal = snapEmail || updated.user?.email;

        const formatOptions: Intl.DateTimeFormatOptions = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        };
        const start = new Date(startDate).toLocaleString('en-AU', formatOptions);
        const end = new Date(endDate).toLocaleString('en-AU', formatOptions);

        const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');

        const userHtml = bookingConfirmationTemplate({
          customerName: customerNameFinal,
          bookingId: updated.id,
          brand: car.brand,
          vehicleName: car.name,
          startDate: start,
          endDate: end,
          totalAmount,
          bondAmount: updated.bondAmount,
          paymentMethod,
          isConfirmed: true,
          hp: car.hp,
          passengers: car.passengers,
          fuelType: car.fuelType,
          transmission: car.transmission,
          airConditioner: car.airConditioner,
          gps: car.gps,
          vehicleClass: car.vehicleClass,
          pickupLocation: updated.pickupLocation,
          returnLocation: updated.returnLocation,
          customTitle: 'Booking Confirmed',
          customDescription: 'Great news! Your booking has been officially confirmed by our team. Your vehicle is now reserved for your requested dates.',
          paymentStatus: paymentMethod === 'CASH' ? 'To be Paid (Cash on Pickup)' : 'Awaiting Payment'
        });

        await this.emailService.sendEmail(customerEmailFinal, 'Booking Confirmed - LesssGo', userHtml);

        // Notify Admin as well
        const settings = await this.settingsService.getSettings();
        await this.emailService.sendEmail(settings.adminEmail, `Booking Confirmed: #${updated.id.slice(-8).toUpperCase()}`, `
          <h2>Booking Confirmed</h2>
          <p>Booking #${updated.id.slice(-8).toUpperCase()} has been confirmed.</p>
          <p><strong>Customer:</strong> ${customerNameFinal}</p>
          <p><strong>Vehicle:</strong> ${car.brand} ${car.name}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        `);

      } catch (err) {
        console.error('Failed to send confirmation email:', err);
      }
    }

    // Send Cancellation Email if status changed to CANCELLED
    if (updateBookingDto.status === 'CANCELLED' && booking.status !== 'CANCELLED') {
      try {
        const { cancellationNoticeTemplate } = await import('../lib/emailTemplates/cancellationNotice');
        const emailHtml = cancellationNoticeTemplate({
          name: updated.user.name || 'Valued Customer',
          bookingId: updated.id,
          carName: updated.car.name,
          brand: updated.car.brand
        });
        await this.emailService.sendEmail(updated.user.email, 'Booking Cancelled - LesssGo', emailHtml);
      } catch (err) {
        console.error('Failed to send cancellation email:', err);
      }
    }

    return updated;
  }

  async confirmPayment(id: string) {
    const booking = await this.findOne(id);

    // Update booking payment status AND bond status
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        bondStatus: 'PAID',
        status: 'CONFIRMED'
      },
      include: { car: true, user: true }
    });

    // Check for existing payment
    const existingPayment = await this.prisma.payment.findFirst({
      where: { bookingId: id }
    });

    if (existingPayment) {
      // Update existing
      await this.prisma.payment.update({
        where: { id: existingPayment.id },
        data: { status: 'PAID', currency: 'PGK' }
      });
    } else {
      // Create missing payment record (Backfill)
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

    // Send confirmation email
    try {
      const { car, startDate, endDate, totalAmount, paymentMethod, customerName: snapName, customerEmail: snapEmail } = updatedBooking;
      const customerNameFinal = snapName || updatedBooking.user?.name || 'Valued Customer';
      const customerEmailFinal = snapEmail || updatedBooking.user?.email;
      const formatOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      };
      const start = new Date(startDate).toLocaleString('en-AU', formatOptions);
      const end = new Date(endDate).toLocaleString('en-AU', formatOptions);

      const { bookingConfirmationTemplate } = await import('../lib/emailTemplates/bookingConfirmation');
      const { paymentReceiptTemplate } = await import('../lib/emailTemplates/paymentReceipt');

      const descriptiveStatus = paymentMethod === 'CASH' ? 'Paid (Cash on Pickup)' : 'Paid (Verified by Admin)';

      const userHtml = bookingConfirmationTemplate({
        customerName: customerNameFinal,
        bookingId: updatedBooking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        bondAmount: updatedBooking.bondAmount,
        paymentMethod,
        isConfirmed: true,
        hp: car.hp,
        passengers: car.passengers,
        fuelType: car.fuelType,
        transmission: car.transmission,
        airConditioner: car.airConditioner,
        gps: car.gps,
        vehicleClass: car.vehicleClass,
        pickupLocation: updatedBooking.pickupLocation,
        returnLocation: updatedBooking.returnLocation,
        customTitle: 'Booking & Payment Confirmed',
        customDescription: 'Your payment has been successfully received and verified by our team. Your reservation and security bond are now fully settled.',
        paymentStatus: descriptiveStatus
      });

      const receiptHtml = paymentReceiptTemplate({
        customerName: customerNameFinal,
        amount: totalAmount,
        bondAmount: updatedBooking.bondAmount,
        bookingId: updatedBooking.id,
        paymentMethod: paymentMethod === 'CASH' ? 'Cash/Manual' : 'Online Payment',
        transactionId: 'MANUAL-CONFIRM',
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      });

      // Send Confirmation AND Receipt to User
      await Promise.all([
        this.emailService.sendEmail(customerEmailFinal, 'Booking & Payment Confirmed - LesssGo', userHtml),
        this.emailService.sendEmail(customerEmailFinal, 'Payment Receipt - LesssGo', receiptHtml)
      ]);

      // Send to Admin (Confirmed)
      const settings = await this.settingsService.getSettings();
      const { adminBookingNotificationTemplate } = await import('../lib/emailTemplates/adminBookingNotification');
      const adminHtml = adminBookingNotificationTemplate({
        customerName: customerNameFinal,
        customerEmail: customerEmailFinal,
        customerPhone: updatedBooking.customerPhone || updatedBooking.user?.phoneNumber || 'N/A',
        bookingId: updatedBooking.id,
        brand: car.brand,
        vehicleName: car.name,
        startDate: start,
        endDate: end,
        totalAmount,
        bondAmount: updatedBooking.bondAmount,
        paymentMethod,
        paymentStatus: descriptiveStatus,
        hp: car.hp,
        vehicleClass: car.vehicleClass,
        transmission: car.transmission,
        fuelType: car.fuelType,
        pickupLocation: updatedBooking.pickupLocation,
        returnLocation: updatedBooking.returnLocation,
        customTitle: 'Payment Received & Confirmed',
        customDescription: `Payment of <strong>${totalAmount + updatedBooking.bondAmount} PGK</strong> (including bond) has been verified for booking #${updatedBooking.id.slice(-8).toUpperCase()}.`,
        isPaid: true
      });

      await this.emailService.sendEmail(settings.adminEmail, 'Payment Received & Booking Confirmed', adminHtml);

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
        status: {
          in: ['PENDING', 'CONFIRMED', 'COMPLETED'] // Only these block availability
        }
      },
      select: {
        startDate: true,
        endDate: true
      }
    });
  }

  async findBySessionId(sessionId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { stripeSessionId: sessionId },
      include: {
        booking: {
          include: {
            car: true
          }
        }
      }
    });

    if (!payment || !payment.booking) {
      throw new NotFoundException('Booking not found for this session');
    }

    return payment.booking;
  }
}
