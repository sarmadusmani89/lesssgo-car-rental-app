import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database cleanup...');

    try {
        // 1. Delete Payments
        const deletedPayments = await prisma.payment.deleteMany({});
        console.log(`Deleted ${deletedPayments.count} payments.`);

        // 2. Delete Bookings
        const deletedBookings = await prisma.booking.deleteMany({});
        console.log(`Deleted ${deletedBookings.count} bookings.`);

        // 3. Delete Cars
        const deletedCars = await prisma.car.deleteMany({});
        console.log(`Deleted ${deletedCars.count} cars.`);

        console.log('Database cleanup completed successfully.');
    } catch (error) {
        console.error('Error during database cleanup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
