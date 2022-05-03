import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ParseOgpFeature } from 'src/features/parse-ogp.feature';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
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
    return this.ogp.parseOgp(query.url).catch((e) => {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }
}
