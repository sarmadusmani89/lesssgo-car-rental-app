import { OnModuleInit } from '@nestjs/common';
export declare class EmailService implements OnModuleInit {
    private transporter;
    onModuleInit(): void;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendBookingConfirmation(email: string, bookingDetails: any): Promise<void>;
    sendNotification(email: string, title: string, message: string): Promise<void>;
    private sendMail;
}
