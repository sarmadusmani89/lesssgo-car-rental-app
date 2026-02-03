import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'sarmadusmani598@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log(`User found: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Verified: ${user.isVerified}`);
    } else {
        console.log(`User with email ${email} NOT found.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
