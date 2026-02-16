import { Injectable } from '@nestjs/common';
import { EmailService } from '../../email/email.service';
import { SettingsService } from '../../settings/settings.service';
import { Booking, Car } from '@prisma/client';

@Injectable()
export class BookingEmailService {
    constructor(
        private readonly emailService: EmailService,
        private readonly settingsService: SettingsService,
    ) { }

    private getFormatOptions(): Intl.DateTimeFormatOptions {
        return {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        };
    }

    private formatDates(startDate: Date, endDate: Date) {
        const options = this.getFormatOptions();
        return {
            start: new Date(startDate).toLocaleString('en-AU', options),
            end: new Date(endDate).toLocaleString('en-AU', options)
        };
    }

    async sendBookingReceived(booking: any) {
        try {
            const { car, startDate, endDate, totalAmount, customerName, customerEmail, paymentMethod } = booking;
            const { start, end } = this.formatDates(startDate, endDate);

            const { bookingConfirmationTemplate } = await import('../../lib/emailTemplates/bookingConfirmation');

            const isCash = paymentMethod === 'CASH';
            const emailSubject = isCash ? 'Booking Confirmed - LesssGo' : 'Booking Received - Awaiting Payment - LesssGo';

            const html = bookingConfirmationTemplate({
                customerName: customerName || 'Valued Customer',
                bookingId: booking.id,
                brand: car.brand,
                vehicleName: car.name,
                startDate: start,
                endDate: end,
                totalAmount,
                bondAmount: booking.bondAmount,
                paymentMethod,
                isConfirmed: isCash,
                hp: car.hp,
                passengers: car.passengers,
                fuelType: car.fuelType,
                transmission: car.transmission,
                airConditioner: car.airConditioner,
                gps: car.gps,
                vehicleClass: car.vehicleClass,
                pickupLocation: booking.pickupLocation,
                returnLocation: booking.returnLocation,
                customTitle: isCash ? 'Booking Confirmed' : 'Booking Received',
                customDescription: isCash
                    ? 'Great news! Your booking is officially confirmed and your vehicle is reserved.'
                    : 'We have received your booking request. Please complete the payment to secure your reservation.',
                paymentStatus: isCash ? 'To be Paid' : 'Awaiting Payment'
            });

            await this.emailService.sendEmail(customerEmail, emailSubject, html);

            if (isCash) {
                await this.sendAdminNotification(booking, 'New Cash Booking');
            }
        } catch (err) {
            console.error('Failed to send booking received email:', err);
        }
    }

    async sendAdminNotification(booking: any, title: string) {
        try {
            const settings = await this.settingsService.getSettings();
            const { car, startDate, endDate, totalAmount, customerName, customerEmail, customerPhone, paymentMethod } = booking;
            const { start, end } = this.formatDates(startDate, endDate);

            const { adminBookingNotificationTemplate } = await import('../../lib/emailTemplates/adminBookingNotification');

            const html = adminBookingNotificationTemplate({
                customerName: customerName || 'Valued Customer',
                customerEmail: customerEmail,
                customerPhone: customerPhone || 'N/A',
                bookingId: booking.id,
                brand: car.brand,
                vehicleName: car.name,
                startDate: start,
                endDate: end,
                totalAmount,
                bondAmount: booking.bondAmount,
                paymentMethod,
                paymentStatus: paymentMethod === 'CASH' ? 'Pending (Cash on Pickup)' : 'Awaiting Online Payment',
                hp: car.hp,
                vehicleClass: car.vehicleClass,
                transmission: car.transmission,
                fuelType: car.fuelType,
                pickupLocation: booking.pickupLocation,
                returnLocation: booking.returnLocation,
                customTitle: title,
                customDescription: `A new booking has been placed. Payment method: ${paymentMethod}.`,
                isPaid: false
            });

            await this.emailService.sendEmail(settings.adminEmail, `Admin Alert: ${title}`, html);
        } catch (err) {
            console.error('Failed to send admin notification:', err);
        }
    }

    async sendConfirmationEmail(booking: any) {
        try {
            const { car, startDate, endDate, totalAmount, paymentMethod, customerName, customerEmail } = booking;
            const { start, end } = this.formatDates(startDate, endDate);

            const { bookingConfirmationTemplate } = await import('../../lib/emailTemplates/bookingConfirmation');

            const html = bookingConfirmationTemplate({
                customerName: customerName || 'Valued Customer',
                bookingId: booking.id,
                brand: car.brand,
                vehicleName: car.name,
                startDate: start,
                endDate: end,
                totalAmount,
                bondAmount: booking.bondAmount,
                paymentMethod,
                isConfirmed: true,
                hp: car.hp,
                passengers: car.passengers,
                fuelType: car.fuelType,
                transmission: car.transmission,
                airConditioner: car.airConditioner,
                gps: car.gps,
                vehicleClass: car.vehicleClass,
                pickupLocation: booking.pickupLocation,
                returnLocation: booking.returnLocation,
                customTitle: 'Booking Confirmed',
                customDescription: 'Great news! Your booking has been officially confirmed by our team.',
                paymentStatus: paymentMethod === 'CASH' ? 'To be Paid (Cash on Pickup)' : 'Awaiting Payment'
            });

            await this.emailService.sendEmail(customerEmail, 'Booking Confirmed - LesssGo', html);
        } catch (err) {
            console.error('Failed to send confirmation email:', err);
        }
    }

    async sendCancellationEmail(booking: any) {
        try {
            const { user, car, customerEmail } = booking;
            const { cancellationNoticeTemplate } = await import('../../lib/emailTemplates/cancellationNotice');

            const html = cancellationNoticeTemplate({
                name: booking.customerName || user?.name || 'Valued Customer',
                bookingId: booking.id,
                carName: car.name,
                brand: car.brand
            });

            await this.emailService.sendEmail(customerEmail || user?.email, 'Booking Cancelled - LesssGo', html);
        } catch (err) {
            console.error('Failed to send cancellation email:', err);
        }
    }

    async sendPaymentConfirmation(booking: any) {
        try {
            const { car, startDate, endDate, totalAmount, paymentMethod, customerName, customerEmail } = booking;
            const { start, end } = this.formatDates(startDate, endDate);

            const { bookingConfirmationTemplate } = await import('../../lib/emailTemplates/bookingConfirmation');
            const { paymentReceiptTemplate } = await import('../../lib/emailTemplates/paymentReceipt');

            const descriptiveStatus = paymentMethod === 'CASH' ? 'Paid (Cash on Pickup)' : 'Paid (Verified by Admin)';

            const confirmationHtml = bookingConfirmationTemplate({
                customerName: customerName || 'Valued Customer',
                bookingId: booking.id,
                brand: car.brand,
                vehicleName: car.name,
                startDate: start,
                endDate: end,
                totalAmount,
                bondAmount: booking.bondAmount,
                paymentMethod,
                isConfirmed: true,
                hp: car.hp,
                passengers: car.passengers,
                fuelType: car.fuelType,
                transmission: car.transmission,
                airConditioner: car.airConditioner,
                gps: car.gps,
                vehicleClass: car.vehicleClass,
                pickupLocation: booking.pickupLocation,
                returnLocation: booking.returnLocation,
                customTitle: 'Booking & Payment Confirmed',
                customDescription: 'Your payment has been successfully received and verified by our team.',
                paymentStatus: descriptiveStatus
            });

            const receiptHtml = paymentReceiptTemplate({
                customerName: customerName || 'Valued Customer',
                amount: totalAmount,
                bondAmount: booking.bondAmount,
                bookingId: booking.id,
                paymentMethod: paymentMethod === 'CASH' ? 'Cash/Manual' : 'Online Payment',
                transactionId: 'MANUAL-CONFIRM',
                date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
            });

            await Promise.all([
                this.emailService.sendEmail(customerEmail, 'Booking & Payment Confirmed - LesssGo', confirmationHtml),
                this.emailService.sendEmail(customerEmail, 'Payment Receipt - LesssGo', receiptHtml)
            ]);
        } catch (err) {
            console.error('Failed to send payment confirmation emails:', err);
        }
    }
}
