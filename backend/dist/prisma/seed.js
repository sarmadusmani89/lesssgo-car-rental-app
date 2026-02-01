"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding data...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lesssgo.com' },
        update: {},
        create: {
            email: 'admin@lesssgo.com',
            password: 'admin_password_hash',
            name: 'Admin User',
            role: client_1.Role.ADMIN,
            isVerified: true,
        },
    });
    const user = await prisma.user.upsert({
        where: { email: 'user@lesssgo.com' },
        update: {},
        create: {
            email: 'user@lesssgo.com',
            password: 'user_password_hash',
            name: 'John Doe',
            role: client_1.Role.USER,
            isVerified: true,
        },
    });
    const vehicles = [
        {
            name: 'Tesla Model 3',
            brand: 'Tesla',
            type: 'Sedan',
            transmission: 'Automatic',
            fuelCapacity: 0,
            pricePerDay: 150,
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
            status: client_1.VehicleStatus.AVAILABLE,
        },
        {
            name: 'Range Rover Sport',
            brand: 'Land Rover',
            type: 'SUV',
            transmission: 'Automatic',
            fuelCapacity: 80,
            pricePerDay: 250,
            imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
            status: client_1.VehicleStatus.AVAILABLE,
        },
        {
            name: 'Audi R8',
            brand: 'Audi',
            type: 'Luxury',
            transmission: 'Automatic',
            fuelCapacity: 75,
            pricePerDay: 400,
            imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f3ca976571a?auto=format&fit=crop&q=80&w=800',
            status: client_1.VehicleStatus.RENTED,
        },
    ];
    for (const v of vehicles) {
        await prisma.vehicle.create({ data: v });
    }
    const vehicle = await prisma.vehicle.findFirst({ where: { status: client_1.VehicleStatus.RENTED } });
    if (vehicle) {
        await prisma.booking.create({
            data: {
                userId: user.id,
                vehicleId: vehicle.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                totalPrice: vehicle.pricePerDay * 7,
                status: client_1.BookingStatus.CONFIRMED,
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
//# sourceMappingURL=seed.js.map