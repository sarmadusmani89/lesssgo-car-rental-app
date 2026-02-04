import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        console.log('\n=== Users in Database ===\n');
        console.log(`Total users: ${users.length}\n`);

        users.forEach((user: any, index: number) => {
            console.log(`${index + 1}. Email: ${user.email}`);
            console.log(`   Name: ${user.name || 'N/A'}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Verified: ${user.isVerified}`);
            console.log(`   Created: ${user.createdAt.toLocaleString()}`);
            console.log(`   ID: ${user.id}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listUsers();
