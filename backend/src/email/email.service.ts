import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../lib/prisma.service';
import { generateVerificationEmail } from '../lib/emailTemplates/verificationEmail';
import { generatePasswordResetEmail } from '../lib/emailTemplates/passwordReset';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    const port = Number(process.env.SMTP_PORT) || 587;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: port,
      secure: port === 465, // true for 465, false for other ports (like 587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify Brevo SMTP connection on startup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Brevo SMTP Connection Error:', error);
      } else {
        console.log('✅ Brevo SMTP Server reached successfully');
      }
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const settings = await this.prisma.systemSettings.findFirst();
    const theme = settings?.theme || 'theme-corporate-blue';
    const verificationLink = `${process.env.FRONTEND_URL}/auth/login?verifyToken=${token}`;
    const htmlContent = generateVerificationEmail(verificationLink, theme);

    try {
      const from = process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`;
      await this.transporter.sendMail({
        from: from,
        to: email,
        subject: 'Verify your email - LesssGo',
        html: htmlContent,
      });
      console.log(`📧 Verification email sent (From: ${from}) to: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send verification email to ${email}:`, error);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const settings = await this.prisma.systemSettings.findFirst();
    const theme = settings?.theme || 'theme-corporate-blue';
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const htmlContent = generatePasswordResetEmail(resetLink, theme);

    try {
      const from = process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`;
      await this.transporter.sendMail({
        from: from,
        to: email,
        subject: 'Reset your password - LesssGo',
        html: htmlContent,
      });
      console.log(`📧 Password reset email sent (From: ${from}) to: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${email}:`, error);
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const from = process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`;
      await this.transporter.sendMail({
        from: from,
        to,
        subject,
        html,
      });
      console.log(`📧 Notification email sent (From: ${from}) to: ${to}`);
    } catch (error) {
      console.error(`❌ Failed to send notification email to ${to}:`, error);
    }
  }
}
