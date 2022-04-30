import { Prisma, PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

/**
 * 全てのテーブルのデータを削除する
 * 参考: https://github.com/prisma/docs/issues/451
 * https://zenn.dev/cohky/articles/prisma-to-truncate
 */
export const cleanupDatabase = async (): Promise<void> => {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  await Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany()),
  );

  prisma.$disconnect();
};

// return date 2022-04-01 00:00:00
export const getTestDate = (): Date => {
  return DateTime.fromObject({
    year: 2022,
    month: 4,
    day: 1,
    hour: 12,
  }).toJSDate();
};

export const execDbSeed = async (): Promise<void> => {
  const prisma = new PrismaClient();
  const date = getTestDate();

  await Promise.all([
    prisma.provider.createMany({
      data: [
        {
          id: 'provider.id',
          title: 'provider.title',
          url: 'provider.url',
          feedUrl: 'provider.feedUrl',
        },
      ],
    }),
  ]);

  await Promise.all([
    prisma.article.createMany({
      data: [
        {
          id: 'article.id1',
          title: 'article.title',
          url: 'article.url',
          type: 'rss',
          publishTimestamp: date,
          providerId: 'provider.id',
        },
        {
          id: 'article.id2',
          title: 'article.title',
          url: 'article.url',
          type: 'rss',
          publishTimestamp: date,
          providerId: 'provider.id',
        },
        {
          title: 'article.title',
          url: 'article.url',
          type: 'rss',
          publishTimestamp: date,
          providerId: 'provider.id',
        },
        {
          title: 'article.title',
          url: 'article.url',
          type: 'rss',
          publishTimestamp: date,
          providerId: 'provider.id',
        },
      ],
    }),
  ]);
};
