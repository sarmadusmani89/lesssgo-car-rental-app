import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
    constructor(private readonly emailService: EmailService) { }

    async sendContactMessage(createContactDto: CreateContactDto) {
        const { name, email, subject, message } = createContactDto;

        // Import template dynamically to avoid circular issues if any, or just direct import
        const { contactFormTemplate } = await import('../lib/emailTemplates/contactForm');

        // Send email to admin
        await this.emailService.sendEmail(
            'sarmadusmani598@gmail.com', // Admin Email
            `Contact Form: ${subject}`,
            contactFormTemplate({ name, email, subject, message })
        );

        // Send confirmation to user (keep existing simple confirmation or create another template later)
        // For now, keeping the existing simple confirmation logic but formatted better for readability in code
        await this.emailService.sendEmail(
            email,
            'We received your message - Lesssgo',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">We've received your message</h2>
                    <p>Hi ${name},</p>
                    <p>Thanks for reaching out! We'll get back to you shortly.</p>
                </div>
            `
        );

        return { message: 'Contact message sent successfully' };
    }
}
