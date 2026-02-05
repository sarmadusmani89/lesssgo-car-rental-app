import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
    imports: [EmailModule, SettingsModule],
    controllers: [ContactController],
    providers: [ContactService],
})
export class ContactModule { }
