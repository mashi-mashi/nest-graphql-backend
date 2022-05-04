import { PrismaClient, Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding...');
}

(async () => {
  await seed();
})();
