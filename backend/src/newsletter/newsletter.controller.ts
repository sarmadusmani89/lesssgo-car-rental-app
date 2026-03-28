import { Controller, Post, Get, Body, BadRequestException, UseGuards, Query } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

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
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getSubscribers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.newsletterService.getAllSubscribers(
            parseInt(page, 10),
            parseInt(limit, 10)
        );
    }
}
