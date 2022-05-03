import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ParseOgpUsecase } from 'src/usecase/parse-ogp.usecase';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ArticleService, ParseOgpUsecase, PrismaService],
})
export class ArticleModule {}
