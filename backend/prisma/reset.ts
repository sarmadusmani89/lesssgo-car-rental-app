import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting user data...');

    const safeDelete = async (model: any, name: string) => {
        try {
            const result = await model.deleteMany();
            console.log(`Deleted ${result.count} ${name}.`);
        } catch (e: any) {
            // P2021: Table does not exist
            if (e.code === 'P2021') {
                console.log(`Table for ${name} does not exist, skipping.`);
            } else {
                console.error(`Error deleting ${name}:`, e);
            }
        }
    };

    try {
        // Delete dependent data first
        await safeDelete(prisma.review, 'reviews');
        await safeDelete(prisma.booking, 'bookings');

        // Delete users
        await safeDelete(prisma.user, 'users');

        console.log('Reset complete.');
    } catch (error) {
        console.error('Unexpected error resetting database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
