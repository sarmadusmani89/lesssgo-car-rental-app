import { PrismaClient, Role, CarStatus, BookingStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Create Admin User 1
    await prisma.user.upsert({
        where: { email: 'admin@lesssgo.com' },
        update: {},
        create: {
            email: 'admin@lesssgo.com',
            password: '$2a$10$8K1p/a0dL3.I2GfLNs0p8.yrZi25GqDZPR.r3BqF9M8TlKdcQ9Z0K', // bcrypt hash of "admin123"
            name: 'Admin User',
            role: Role.ADMIN,
            isVerified: true,
        },
    });

    // Create Admin User 2 (Demo Admin)
    await prisma.user.upsert({
        where: { email: 'sarmadusmani327@gmail.com' },
        update: {},
        create: {
            email: 'sarmadusmani327@gmail.com',
            password: '$2a$10$8K1p/a0dL3.I2GfLNs0p8.yrZi25GqDZPR.r3BqF9M8TlKdcQ9Z0K', // bcrypt hash of "admin123"
            name: 'Demo Admin',
            role: Role.ADMIN,
            isVerified: true,
        },
    });

    // Create Regular User
    const user = await prisma.user.upsert({
        where: { email: 'user@lesssgo.com' },
        update: {},
        create: {
            email: 'user@lesssgo.com',
            password: '$2a$10$8K1p/a0dL3.I2GfLNs0p8.yrZi25GqDZPR.r3BqF9M8TlKdcQ9Z0K', // bcrypt hash of "user123"
            name: 'John Doe',
            role: Role.USER,
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
            imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f3ca976571a?auto=format&fit=crop&q=80&w=800',
            description: 'High-performance sports car',
            status: CarStatus.RENTED,
        },
    ];

    for (const v of cars) {
        await prisma.car.create({ data: v });
    }

    // Create a Booking
    const car = await prisma.car.findFirst({ where: { status: CarStatus.RENTED } });
    if (car) {
        const startDate = new Date();
        const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        await prisma.booking.create({
            data: {
                userId: user.id,
                carId: car.id,
                startDate,
                endDate,
                totalAmount: car.pricePerDay * 7,
                status: BookingStatus.CONFIRMED,
                paymentStatus: PaymentStatus.PAID,
                paymentMethod: PaymentMethod.CARD,
                customerName: user.name || 'John Doe',
                customerEmail: user.email,
                customerPhone: '+1234567890',
            },
        });
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
