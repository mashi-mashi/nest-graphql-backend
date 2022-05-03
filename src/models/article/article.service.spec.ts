import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/common/prisma.service';
import { cleanupDatabase, execDbSeed } from 'test/test-db-util';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let pService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, PrismaService],
    }).compile();

    service = module.get<ArticleService>(ArticleService);

    await cleanupDatabase();
    await execDbSeed();
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
