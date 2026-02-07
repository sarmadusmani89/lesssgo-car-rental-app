import { Controller, Get, Put, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { CurrencyService } from './currency.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('settings')
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
        private readonly currencyService: CurrencyService
    ) { }

    @Get()
    getSettings() {
        return this.settingsService.getSettings();
    }

    @Get('rates')
    getRates() {
        return this.currencyService.getRates();
    }

    @Put()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('favicon'))
    updateSettings(
        @Body() data: any,
        @UploadedFile() favicon?: Express.Multer.File
    ) {
        return this.settingsService.updateSettings(data, favicon);
    }
}

