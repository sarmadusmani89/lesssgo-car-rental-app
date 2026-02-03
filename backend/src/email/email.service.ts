import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;

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
  }

  async sendVerificationEmail(email: string, token: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'Verify your email',
      text: `Verify using token: ${token}`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: 'Reset password',
      text: `Reset token: ${token}`,
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to,
      subject,
      html,
    });
  }
}
