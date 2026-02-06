
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'sarmadusmani598@gmail.com';
    const password = 'Password@123'; // Temporary password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            isVerified: true,
            name: 'Admin User'
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            isVerified: true,
        },
    });

    console.log(`Admin user created/updated: ${user.email} with role ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
