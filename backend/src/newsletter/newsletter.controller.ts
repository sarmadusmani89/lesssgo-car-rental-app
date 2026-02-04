import { Controller, Post, Get, Body, BadRequestException } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
    constructor(private readonly newsletterService: NewsletterService) { }

    @Post('subscribe')
    async subscribe(@Body('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email is required');
        }
        return this.newsletterService.subscribe(email);
    }

    @Get()
    async getSubscribers() {
        return this.newsletterService.getAllSubscribers();
    }
}
