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

    private async getMailConfig() {
        const settings = await this.settingsService.getSettings();
        return {
            siteName: settings?.siteName || 'Lesssgo Car Rental',
            address: settings?.contactAddress || 'Port Moresby, Papua New Guinea',
            contactEmail: settings?.contactEmail || 'support@lesssgo.com',
            theme: settings?.theme || 'theme-corporate-blue'
        };
    }

    async sendBookingReceived(booking: any) {
        try {
            const config = await this.getMailConfig();
            const { car, startDate, endDate, totalAmount, customerName, customerEmail, paymentMethod } = booking;
            const { start, end } = this.formatDates(startDate, endDate);

            const { bookingConfirmationTemplate } = await import('../../lib/emailTemplates/bookingConfirmation');

            const isCash = paymentMethod === 'CASH';
            const emailSubject = isCash ? `Booking Confirmed - ${config.siteName}` : `Booking Received - Awaiting Payment - ${config.siteName}`;

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
            }, config);

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
            const config = await this.getMailConfig();
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
            }, config);

            await this.emailService.sendEmail(settings.adminEmail, `Admin Alert: ${title}`, html);
        } catch (err) {
            console.error('Failed to send admin notification:', err);
        }
    }

    async sendConfirmationEmail(booking: any) {
        try {
            const config = await this.getMailConfig();
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
            }, config);

            await this.emailService.sendEmail(customerEmail, `Booking Confirmed - ${config.siteName}`, html);
        } catch (err) {
            console.error('Failed to send confirmation email:', err);
        }
    }

    async sendStripePaymentConfirmation(booking: any, transactionId: string) {
        try {
            const config = await this.getMailConfig();
            const { user, car, startDate, endDate, totalAmount, customerName: snapName, customerEmail: snapEmail } = booking;
            const customerName = snapName || user?.name || 'Valued Customer';
            const customerEmail = snapEmail || user?.email;

            const { start, end } = this.formatDates(startDate, endDate);

            const { bookingConfirmationTemplate } = await import('../../lib/emailTemplates/bookingConfirmation');
            const { paymentReceiptTemplate } = await import('../../lib/emailTemplates/paymentReceipt');
            const { adminBookingNotificationTemplate } = await import('../../lib/emailTemplates/adminBookingNotification');

            const confirmHtml = bookingConfirmationTemplate({
                customerName,
                bookingId: booking.id,
                brand: car.brand,
                vehicleName: car.name,
                startDate: start,
                endDate: end,
                totalAmount,
                bondAmount: booking.bondAmount,
                paymentMethod: 'ONLINE',
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
                customDescription: 'Great news! Your online payment was successful and your booking is officially confirmed.',
                paymentStatus: 'Paid'
            }, config);

            const receiptHtml = paymentReceiptTemplate({
                customerName,
                amount: totalAmount,
                bondAmount: booking.bondAmount,
                bookingId: booking.id,
                paymentMethod: 'Stripe Online',
                transactionId,
                date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
            }, config);

            const settings = await this.settingsService.getSettings();

            const adminHtml = adminBookingNotificationTemplate({
                customerName,
                customerEmail,
                customerPhone: user?.phoneNumber || 'N/A',
                bookingId: booking.id,
                brand: car.brand,
                vehicleName: car.name,
                startDate: start,
                endDate: end,
                totalAmount,
                bondAmount: booking.bondAmount,
                paymentMethod: 'ONLINE',
                paymentStatus: 'Confirmed (Paid via Stripe)',
                hp: car.hp,
                vehicleClass: car.vehicleClass,
                transmission: car.transmission,
                fuelType: car.fuelType,
                pickupLocation: booking.pickupLocation,
                returnLocation: booking.returnLocation,
                customTitle: 'Booking Paid - Stripe',
                customDescription: `Online payment received via Stripe for booking #${booking.id.slice(-8).toUpperCase()}. Booking is now fully confirmed.`,
                isPaid: true
            }, config);

            await Promise.all([
                this.emailService.sendEmail(customerEmail, `Booking & Payment Confirmed - ${config.siteName}`, confirmHtml),
                this.emailService.sendEmail(customerEmail, `Payment Receipt - ${config.siteName}`, receiptHtml),
                this.emailService.sendEmail(settings.adminEmail, 'Booking Paid: Stripe Payment Received', adminHtml)
            ]);
        } catch (err) {
            console.error('Failed to send Stripe payment confirmation emails:', err);
        }
    }

    async sendCancellationEmail(booking: any) {
        try {
            const config = await this.getMailConfig();
            const { user, car, customerEmail } = booking;
            const { cancellationNoticeTemplate } = await import('../../lib/emailTemplates/cancellationNotice');

            const html = cancellationNoticeTemplate({
                name: booking.customerName || user?.name || 'Valued Customer',
                bookingId: booking.id,
                carName: car.name,
                brand: car.brand
            }, config);

            await this.emailService.sendEmail(customerEmail || user?.email, `Booking Cancelled - ${config.siteName}`, html);
        } catch (err) {
            console.error('Failed to send cancellation email:', err);
        }
    }

    async sendPaymentConfirmation(booking: any) {
        try {
            const config = await this.getMailConfig();
            const { car, startDate, endDate, totalAmount, paymentMethod, customerName, customerEmail } = booking;
            const { start, end } = this.formatDates(startDate, endDate);

            const { bookingConfirmationTemplate } = await import('../../lib/emailTemplates/bookingConfirmation');
            const { paymentReceiptTemplate } = await import('../../lib/emailTemplates/paymentReceipt');

            const descriptiveStatus = paymentMethod === 'CASH' ? 'Paid (Cash on Pickup)' : paymentMethod === 'ONLINE' ? 'Paid (Stripe Online)' : 'Paid (Verified Card)';

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
            }, config);

            const receiptHtml = paymentReceiptTemplate({
                customerName: customerName || 'Valued Customer',
                amount: totalAmount,
                bondAmount: booking.bondAmount,
                bookingId: booking.id,
                paymentMethod: paymentMethod === 'CASH' ? 'Cash/Manual' : paymentMethod === 'ONLINE' ? 'Stripe Payment' : 'Card Payment',
                transactionId: 'MANUAL-CONFIRM',
                date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
            }, config);

            await Promise.all([
                this.emailService.sendEmail(customerEmail, `Booking & Payment Confirmed - ${config.siteName}`, confirmationHtml),
                this.emailService.sendEmail(customerEmail, `Payment Receipt - ${config.siteName}`, receiptHtml)
            ]);
        } catch (err) {
            console.error('Failed to send payment confirmation emails:', err);
        }
    }
}
