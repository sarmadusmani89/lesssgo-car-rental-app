const { PrismaClient } = require('@prisma/client');

async function debugCars() {
    const prisma = new PrismaClient();
    try {
        console.log('--- debugCars START ---');
        console.log('Testing findMany...');
        const cars = await prisma.car.findMany({
            orderBy: { createdAt: 'desc' }
        });
        console.log(`Successfully fetched ${cars.length} cars.`);
        if (cars.length > 0) {
            console.log('Data structure check:', Object.keys(cars[0]));
        }
        console.log('--- debugCars SUCCESS ---');
    } catch (error: any) {
        console.error('--- debugCars FAILED ---');
        console.error('Error Name:', error.name);
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        if (error.stack) console.error('Stack Trace:', error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

debugCars();
