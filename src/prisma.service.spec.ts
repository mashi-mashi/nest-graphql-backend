import { cleanupDatabase, getTestDate } from './../test/test-db-util';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = new PrismaService();
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('リレーションの削除、cascaed', async () => {
    const providerId = 'PROVIDER_ID';
    await prisma.provider.createMany({
      data: [
        {
          id: providerId,
          title: 'provider.title',
          url: 'provider.url',
          feedUrl: 'provider.feedUrl',
        },
      ],
    });

    await Promise.all([
      prisma.article.createMany({
        data: [
          {
            title: 'article.title',
            url: 'article.url',
            type: 'rss',
            publishTimestamp: getTestDate(),
            providerId: providerId,
          },
          {
            title: 'article.title',
            url: 'article.url',
            type: 'rss',
            publishTimestamp: getTestDate(),
            providerId: providerId,
          },
        ],
      }),
    ]);

    const createdProviders = await prisma.provider.findMany();
    const createdArticles = await prisma.article.findMany({
      where: {
        providerId: providerId,
      },
    });

    expect(createdProviders.length).toBe(1);
    expect(createdArticles.length).toBe(2);

    await prisma.provider.deleteMany();

    const deletedProviders = await prisma.provider.findMany();
    const deletedArticles = await prisma.article.findMany({
      where: {
        providerId: providerId,
      },
    });

    expect(deletedProviders.length).toBe(0);
    expect(deletedArticles.length).toBe(0);
  });
});
