import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ContactService {
    constructor(
        private readonly emailService: EmailService,
        private readonly settingsService: SettingsService
    ) { }

    async sendContactMessage(createContactDto: CreateContactDto) {
        const { name, email, subject, message } = createContactDto;
        const settings = await this.settingsService.getSettings();
        
        const config = {
            siteName: settings?.siteName || 'Lesssgo Car Rental',
            address: settings?.contactAddress || 'Port Moresby, Papua New Guinea',
            contactEmail: settings?.contactEmail || 'support@lesssgo.com',
            theme: settings?.theme || 'theme-corporate-blue'
        };

        const { contactFormTemplate } = await import('../lib/emailTemplates/contactForm');

        // Send email to admin
        await this.emailService.sendEmail(
            settings.adminEmail || 'sarmadusmani598@gmail.com',
            `Contact Form: ${subject}`,
            contactFormTemplate({ name, email, subject, message }, config)
        );

        // Send confirmation to user
        await this.emailService.sendEmail(
            email,
            `We received your message - ${config.siteName}`,
            `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">We've received your message</h2>
                    <p>Hi ${name},</p>
                    <p>Thanks for reaching out to <strong>${config.siteName}</strong>! We'll get back to you shortly.</p>
                </div>
            `
        );

        return { message: 'Contact message sent successfully' };
    }
}
