const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Bookings & Payments Cleanup ---');

    try {
        // 1. Delete all Payment records first (Foreign Key constraint)
        const paymentResult = await prisma.payment.deleteMany({});
        console.log(`✅ Deleted ${paymentResult.count} payment records.`);

        // 2. Delete all Booking records
        const bookingResult = await prisma.booking.deleteMany({});
        console.log(`✅ Deleted ${bookingResult.count} booking records.`);

        console.log('--- Cleanup Complete ---');
        console.log(`Summary: All ${bookingResult.count} bookings and ${paymentResult.count} payments have been removed.`);
    } catch (error) {
        if (error.code === 'P2021') {
            console.error('❌ Table not found. Please ensure your database is migrated.');
        } else {
            console.error('❌ Unexpected error during cleanup:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
