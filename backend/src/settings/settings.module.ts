import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CurrencyService } from './currency.service';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../lib/prisma.service';

@Module({
    controllers: [SettingsController],
    providers: [SettingsService, CurrencyService, PrismaService],
    exports: [SettingsService, CurrencyService],
})
export class SettingsModule { }

