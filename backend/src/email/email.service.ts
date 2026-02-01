import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
    private transporter: nodemailer.Transporter;

    onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        await this.sendMail({
            to: email,
            subject: 'Reset your password - Lesssgo',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px;">Reset Password</a>
        </div>
      `,
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${token}`;
        await this.sendMail({
            to: email,
            subject: 'Verify your email - Lesssgo',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Welcome to Lesssgo!</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; rounded: 8px;">Verify Account</a>
        </div>
      `,
        });
    }

    async sendBookingConfirmation(email: string, bookingDetails: any) {
        await this.sendMail({
            to: email,
            subject: 'Booking Confirmation - Lesssgo',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Booking Confirmed!</h2>
          <p>Your booking for <strong>${bookingDetails.vehicleName}</strong> has been confirmed.</p>
          <p>Duration: ${bookingDetails.startDate} to ${bookingDetails.endDate}</p>
          <p>Total Price: $${bookingDetails.totalPrice}</p>
        </div>
      `,
        });
    }

    async sendNotification(email: string, title: string, message: string) {
        await this.sendMail({
            to: email,
            subject: title,
            html: `<p>${message}</p>`,
        });
    }

    private async sendMail(options: nodemailer.SendMailOptions) {
        try {
            await this.transporter.sendMail({
                from: '"Lesssgo Auto" <noreply@lesssgo.com>',
                ...options,
            });
            console.log(`[EmailService] Email sent to ${options.to}`);
        } catch (error) {
            console.error('[EmailService] Failed to send email:', error);
        }
    }
}
