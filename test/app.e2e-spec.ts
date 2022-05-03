import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { cleanupDatabase } from './test-db-util';
import { PrismaService } from 'src/common/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await cleanupDatabase();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('TTT', async () => {
    const prisma = new PrismaService();
    await prisma.article.create({
      data: {
        id: 'article.id',
        title: 'article.title',
        url: 'article.url',
        type: 'rss',
        publishTimestamp: new Date(),
        providerId: 'provider.id',
      },
    });

    const a = await prisma.article.findFirst({
      where: {
        id: 'article.id',
      },
    });

    console.log('a');
  });
});
