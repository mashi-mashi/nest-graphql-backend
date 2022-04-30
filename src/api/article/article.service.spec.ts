import { Test, TestingModule } from '@nestjs/testing';
import { cleanupDatabase, execDbSeed } from './../../../test/test-db-util';
import { PrismaService } from './../../prisma.service';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let pService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, PrismaService],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    pService = new PrismaService();

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
