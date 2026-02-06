
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'sarmadusmani327@gmail.com';
    const password = 'Password@123'; // Temporary password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: Role.USER,
            isVerified: true,
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Verified User',
            role: Role.USER,
            isVerified: true,
        },
    });

    console.log(`Verified user created/updated: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
