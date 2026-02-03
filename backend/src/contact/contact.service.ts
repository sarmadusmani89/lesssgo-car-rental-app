import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
    constructor(private readonly emailService: EmailService) { }

    async sendContactMessage(createContactDto: CreateContactDto) {
        const { name, email, subject, message } = createContactDto;

        // Send email to admin/support team
        await this.emailService.sendEmail(
            'support@lesssgo.com',
            `Contact Form: ${subject}`,
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                    </div>
                    <div style="margin-top: 20px;">
                        <h3>Message:</h3>
                        <p style="line-height: 1.6;">${message}</p>
                    </div>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; font-size: 0.875rem;">
                        This message was sent from the Lesssgo contact form.
                    </p>
                </div>
            `,
        );

        // Send confirmation email to user
        await this.emailService.sendEmail(
            email,
            'We received your message - Lesssgo',
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Thank You for Contacting Us!</h2>
                    <p>Hi ${name},</p>
                    <p>We've received your message and will get back to you as soon as possible, usually within 24 hours.</p>
                    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Your Message:</h3>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p style="line-height: 1.6;">${message}</p>
                    </div>
                    <p>If you need immediate assistance, please call us at +1 (555) 123-4567.</p>
                    <p>Best regards,<br>The Lesssgo Team</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; font-size: 0.875rem;">
                        This is an automated confirmation email. Please do not reply to this message.
                    </p>
                </div>
            `,
        );

        return { message: 'Contact message sent successfully' };
    }
}
