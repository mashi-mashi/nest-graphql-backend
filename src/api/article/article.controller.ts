import { Controller, Get, Query } from '@nestjs/common';
import { ParseOgpUsecase } from 'src/usecase/parse-ogp.usecase';

@Controller('articles')
export class ArticleController {
  constructor(private readonly ogp: ParseOgpUsecase) {}

  @Get()
  getHello(): string {
    return 'Hello World! article';
  }

  @Get('/parse-ogp')
  async parseOgp(@Query() query: { url: string }): Promise<any> {
    return this.ogp.parseOgp(query.url);
  }
}
