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
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already subscribed');
            }
            throw error;
        }
    }

    async getAllSubscribers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [subscribers, totalCount] = await Promise.all([
            this.prisma.newsletterSubscriber.findMany({
                skip,
                take: limit,
                orderBy: { subscribedAt: 'desc' },
            }),
            this.prisma.newsletterSubscriber.count(),
        ]);

        return {
            subscribers,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        };
    }
}
