import { PrismaClient, Role, CarStatus, BookingStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lesssgo.com' },
        update: {},
        create: {
            email: 'admin@lesssgo.com',
            password: 'admin_password_hash', // In real app, this should be bcrypt hashed
            name: 'Admin User',
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
            password: 'user_password_hash',
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
            status: CarStatus.RENTED,
        },
    ];

    for (const v of cars) {
        await prisma.car.create({ data: v });
    }

    // Create a Booking
    const car = await prisma.car.findFirst({ where: { status: CarStatus.RENTED } });
    if (car) {
        await prisma.booking.create({
            data: {
                userId: user.id,
                carId: car.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                totalPrice: car.pricePerDay * 7,
                status: BookingStatus.CONFIRMED,
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
