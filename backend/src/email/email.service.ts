import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generateVerificationEmail } from '../lib/emailTemplates/verificationEmail';
import { generatePasswordResetEmail } from '../lib/emailTemplates/passwordReset';

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.FRONTEND_URL}/auth/login?verifyToken=${token}`;
    const htmlContent = generateVerificationEmail(verificationLink);

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '✅ Verify your email - LesssGo',
      html: htmlContent,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const htmlContent = generatePasswordResetEmail(resetLink);

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Reset your password - LesssGo',
      html: htmlContent,
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }
}
