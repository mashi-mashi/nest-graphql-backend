import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ParseOgpFeature } from 'src/features/parse-ogp.feature';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ArticleService, ParseOgpFeature, PrismaService],
})
export class ArticleModule {}
