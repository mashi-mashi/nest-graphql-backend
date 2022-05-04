import { PrismaClient, Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
const prisma = new PrismaClient();

async function seed() {}

(async () => {
  await seed();
})();
