import { PrismaClient, Role, CarStatus, BookingStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Create Single Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'sarmadusmani598@gmail.com' },
        update: {},
        create: {
            email: 'sarmadusmani598@gmail.com',
            password: '$2a$10$8K1p/a0dL3.I2GfLNs0p8.yrZi25GqDZPR.r3BqF9M8TlKdcQ9Z0K', // bcrypt hash of "admin123"
            name: 'Admin',
            role: Role.ADMIN,
            isVerified: true,
        },
    });

    // Create Cars
    const cars = [
        {
            name: 'Tesla Model 3',
            brand: 'Tesla',
            type: 'Sedan',
            transmission: 'Automatic',
            fuelCapacity: 0,
            pricePerDay: 150,
            hp: 450,
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
            description: 'Electric luxury sedan with autopilot',
            status: CarStatus.AVAILABLE,
        },
        {
            name: 'Range Rover Sport',
            brand: 'Land Rover',
            type: 'SUV',
            transmission: 'Automatic',
            fuelCapacity: 80,
            pricePerDay: 250,
            hp: 400,
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
            description: 'Luxury SUV with premium features',
            status: CarStatus.AVAILABLE,
        },
        {
            name: 'Audi R8',
            brand: 'Audi',
            type: 'Luxury',
            transmission: 'Automatic',
            fuelCapacity: 75,
            pricePerDay: 400,
            hp: 600,
            imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f3ca976571a?auto=format&fit=crop&q=80&w=800',
            description: 'High-performance sports car',
            status: CarStatus.RENTED,
        },
    ];

    for (const v of cars) {
        await prisma.car.create({ data: v });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
