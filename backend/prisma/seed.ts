import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Create Single Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'sarmadusmani598@gmail.com' },
        update: {},
        create: {
            email: 'sarmadusmani598@gmail.com',
            password: '$2a$10$8K1p/a0dL3.I2GfLNs0p8.yrZi25GqDZPR.r3BqF9M8TlKdcQ9Z0K', // bcrypt hash of "admin123"
            name: 'Admin',
            role: Role.ADMIN,
            isVerified: true,
        },
    });

    console.log('Admin user created:', admin.email);

    // 2. Create Default System Settings
    const settingsCount = await prisma.systemSettings.count();
    if (settingsCount === 0) {
        await prisma.systemSettings.create({
            data: {
                siteName: 'Lesssgo Car Rental',
                maintenanceMode: false,
                currency: 'USD',
                passwordMinLength: 8,
            },
        });
        console.log('Default system settings created.');
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
