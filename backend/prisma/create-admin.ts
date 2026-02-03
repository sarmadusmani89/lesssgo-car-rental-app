import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'sarmadusmani598@gmail.com';
    const password = 'Sarmad@175413';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: Role.ADMIN,
            isVerified: true,
            name: 'Sarmad Usmani'
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Sarmad Usmani',
            role: Role.ADMIN,
            isVerified: true,
        },
    });

    console.log(`Admin user created/updated: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
