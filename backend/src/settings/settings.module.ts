import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from '../lib/prisma.service';

@Module({
    controllers: [SettingsController],
    providers: [SettingsService, PrismaService],
})
export class SettingsModule { }
