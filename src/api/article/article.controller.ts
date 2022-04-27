import { Controller, Get, Query } from '@nestjs/common';
import { ParseOgpUsecase } from 'src/usecase/parse-ogp.usecase';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly ogp: ParseOgpUsecase,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  async getAll(@Query() query: { providerId: string }) {
    return this.articleService.getAll({
      where: {
        providerId: query.providerId,
      },
    });
  }

  @Get('/parse-ogp')
  async parseOgp(@Query() query: { url: string }): Promise<any> {
    return this.ogp.parseOgp(query.url);
  }
}
