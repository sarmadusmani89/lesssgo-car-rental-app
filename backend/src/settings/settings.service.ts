import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        // Try to find the first settings record
        let settings = await this.prisma.systemSettings.findFirst();

        // If no settings exist, create default
        if (!settings) {
            settings = await this.prisma.systemSettings.create({
                data: {
                    siteName: 'Lesssgo Car Rental',
                    adminEmail: 'sarmadusmani598@gmail.com',
                    maintenanceMode: false,
                    currency: 'AUD',
                },
            });
        }

        return settings;
    }

    async updateSettings(data: any) {
        const settings = await this.getSettings();

        return this.prisma.systemSettings.update({
            where: { id: settings.id },
            data,
        });
    }
}
