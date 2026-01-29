import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    async sendVerificationEmail(email: string, token: string) {
        const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
        console.log(`[EmailService] Sending verification email to ${email}`);
        console.log(`[EmailService] Link: ${verificationLink}`);
        // In a real app, use nodemailer or a service like SendGrid
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        console.log(`[EmailService] Sending password reset email to ${email}`);
        console.log(`[EmailService] Link: ${resetLink}`);
    }
}
