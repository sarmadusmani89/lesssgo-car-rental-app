import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CurrencyService } from './currency.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../lib/prisma.service';
import { CloudinaryService } from '../lib/cloudinary.service';
import { CloudinaryProvider } from '../lib/cloudinary.provider';

@Module({
    controllers: [SettingsController],
    providers: [SettingsService, CurrencyService, PrismaService, CloudinaryService, CloudinaryProvider],
    exports: [SettingsService, CurrencyService],
})
export class SettingsModule { }

