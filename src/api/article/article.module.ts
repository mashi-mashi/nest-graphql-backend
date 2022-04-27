import { Module } from '@nestjs/common';
import { ParseOgpUsecase } from 'src/usecase/parse-ogp.usecase';
import { ArticleController } from './article.controller';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ParseOgpUsecase],
})
export class ArticleModule {}
