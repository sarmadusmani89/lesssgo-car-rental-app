
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'land-cruiser-test';
    const car = await prisma.car.upsert({
        where: { slug }, // Since slug is unique. If id was unique only, this would fail if slug didn't exist but name did? No, slug is unique now.
        update: {},
        create: {
            name: 'Land Cruiser Test',
            brand: 'Toyota',
            type: 'SUV',
            transmission: 'Automatic',
            fuelCapacity: 80,
            pricePerDay: 150,
            imageUrl: 'https://placehold.co/600x400',
            description: 'A robust SUV for all terrains.',
            slug: slug,
            pickupLocation: ['Airport', 'City Center'],
            dropoffLocation: ['Airport', 'City Center'],
            passengers: 5,
            fuelType: 'Diesel',
            hp: 300,
            gallery: [],
            status: 'AVAILABLE'
        },
    });
    console.log('Created car with slug:', car.slug);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
