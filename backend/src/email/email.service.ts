import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { generateVerificationEmail } from '../lib/emailTemplates/verificationEmail';
import { generatePasswordResetEmail } from '../lib/emailTemplates/passwordReset';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection on startup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Error:', error);
      } else {
        console.log('✅ SMTP Server reached successfully');
      }
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.FRONTEND_URL}/auth/login?verifyToken=${token}`;
    const htmlContent = generateVerificationEmail(verificationLink);

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify your email - LesssGo',
        html: htmlContent,
      });
      console.log(`📧 Verification email sent to: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send verification email to ${email}:`, error);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
    const htmlContent = generatePasswordResetEmail(resetLink);

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset your password - LesssGo',
        html: htmlContent,
      });
      console.log(`📧 Password reset email sent to: ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send password reset email to ${email}:`, error);
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL || `"LesssGo" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`📧 Notification email sent to: ${to}`);
    } catch (error) {
      console.error(`❌ Failed to send notification email to ${to}:`, error);
    }
  }
}
