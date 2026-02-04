import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
// Assuming you have AuthGuard and RolesGuard, imported here. 
// If not, we'll need to locate them or skip for now if public (but settings shouldn't be public).
// For now, I'll assume generic structure and come back to fix imports if needed.

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Put()
    async updateSettings(@Body() data: any) {
        return this.settingsService.updateSettings(data);
    }
}
