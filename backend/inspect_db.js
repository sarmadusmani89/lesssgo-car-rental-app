
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const recentPayments = await prisma.payment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { booking: true }
  });
  console.log('--- RECENT PAYMENTS ---');
  console.log(JSON.stringify(recentPayments, null, 2));

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' }
  });
  console.log('--- RECENT BOOKINGS ---');
  console.log(JSON.stringify(recentBookings, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
