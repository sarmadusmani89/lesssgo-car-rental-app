import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { CloudinaryService } from '../lib/cloudinary.service';

@Injectable()
export class SettingsService {
    constructor(
        private prisma: PrismaService,
        private cloudinary: CloudinaryService
    ) { }

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
                    currency: 'PGK',
                },
            });
        }

        return settings;
    }

    async updateSettings(data: any, favicon?: Express.Multer.File) {
        const settings = await this.getSettings();

        // Handle type conversion for multipart/form-data (where everything is a string)
        if (typeof data.maintenanceMode === 'string') {
            data.maintenanceMode = data.maintenanceMode === 'true';
        }

        if (typeof data.passwordMinLength === 'string') {
            data.passwordMinLength = parseInt(data.passwordMinLength, 10);
        }

        if (favicon) {
            try {
                const upload = await this.cloudinary.uploadFile(favicon);
                data.faviconUrl = upload.secure_url;
            } catch (error) {
                throw new BadRequestException('Failed to upload favicon');
            }
        }

        return this.prisma.systemSettings.update({
            where: { id: settings.id },
            data,
        });
    }
}
