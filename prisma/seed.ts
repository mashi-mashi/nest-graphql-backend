import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  await prisma.timeline.createMany({
    data: [
      { title: 'title1', status: 'private' },
      { title: 'title2', status: 'public' },
    ],
  });
}

(async () => {
  await prisma.timeline.update({
    where: { id: 'f7e97458-705d-4a4c-9966-093ba18ee908' },
    data: {
      title: 'title10',
    },
  });
})();
