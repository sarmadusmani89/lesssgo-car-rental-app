import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing payments and bookings...');

    try {
        // Delete payments first because they depend on bookings
        const deletedPayments = await prisma.payment.deleteMany();
        console.log(`Deleted ${deletedPayments.count} payments.`);

        // Then delete bookings
        const deletedBookings = await prisma.booking.deleteMany();
        console.log(`Deleted ${deletedBookings.count} bookings.`);

        console.log('Successfully cleared all payments and bookings.');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
