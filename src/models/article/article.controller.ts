import { Controller, Get, Query } from '@nestjs/common';
import { ParseOgpFeature } from 'src/features/parse-ogp.feature';
import { CustomLogger } from 'src/util/logger';
import { sendResponse } from 'src/util/response-util';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  private readonly logger = new CustomLogger(ArticleController.name);

  constructor(
    private readonly ogp: ParseOgpFeature,
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
    return sendResponse(() => this.ogp.parseOgp(query.url), {
      logger: this.logger,
    });
  }
}
