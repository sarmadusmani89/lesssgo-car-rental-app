const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Data Cleanup ---');

    const safeDelete = async (model, name, where = {}) => {
        try {
            const result = await model.deleteMany({ where });
            console.log(`✅ Deleted ${result.count} ${name}.`);
            return result.count;
        } catch (e) {
            if (e.code === 'P2021') {
                console.log(`⚠️ Table for ${name} does not exist, skipping.`);
            } else {
                console.error(`❌ Error deleting ${name}:`, e);
            }
            return 0;
        }
    };

    try {
        // 1. Delete Payments (Dependent on Bookings)
        await safeDelete(prisma.payment, 'payments');

        // 2. Delete Reviews (Dependent on Users/Cars)
        await safeDelete(prisma.review, 'reviews');

        // 3. Delete Bookings (Dependent on Users/Cars)
        await safeDelete(prisma.booking, 'bookings');

        // 4. Delete Users (Exclude ADMINs)
        const deletedUsersCount = await safeDelete(prisma.user, 'non-admin users', {
            role: {
                not: 'ADMIN'
            }
        });

        console.log('--- Cleanup Complete ---');
        console.log(`Summary: All bookings, payments, and reviews removed. ${deletedUsersCount} non-admin users deleted.`);
    } catch (error) {
        console.error('Unexpected error during data cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
