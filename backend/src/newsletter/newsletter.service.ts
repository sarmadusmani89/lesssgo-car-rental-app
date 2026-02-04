import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class NewsletterService {
    constructor(private prisma: PrismaService) { }

    async subscribe(email: string) {
        try {
            return await this.prisma.newsletterSubscriber.create({
                data: { email },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already subscribed');
            }
            throw error;
        }
    }

    async getAllSubscribers() {
        return this.prisma.newsletterSubscriber.findMany({
            orderBy: { subscribedAt: 'desc' },
        });
    }
}
