import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CurrencyService } from './currency.service';
import { SettingsController } from './settings.controller';
import { CloudinaryService } from '../lib/cloudinary.service';
import { CloudinaryProvider } from '../lib/cloudinary.provider';
@Module({
    controllers: [SettingsController],
    providers: [SettingsService, CurrencyService, CloudinaryService, CloudinaryProvider],
    exports: [SettingsService, CurrencyService],
})
export class SettingsModule { }

