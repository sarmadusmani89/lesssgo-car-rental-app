import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'sarmadusmani327@gmail.com';
    const result = await prisma.user.deleteMany({
        where: { email }
    });
    console.log(`Deleted ${result.count} users with email: ${email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
