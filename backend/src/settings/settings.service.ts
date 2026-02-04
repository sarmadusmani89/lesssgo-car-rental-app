import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        const settings = await this.prisma.systemSettings.findFirst();
        if (!settings) {
            return this.prisma.systemSettings.create({
                data: {
                    siteName: 'Lesssgo Car Rental',
                    currency: 'USD',
                    maintenanceMode: false,
                    passwordMinLength: 8,
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
