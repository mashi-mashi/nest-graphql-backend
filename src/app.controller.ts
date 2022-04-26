import { Controller, Get } from '@nestjs/common';
import { Article } from '@prisma/client';
import { AppService } from './app.service';
import { ArticleService } from './article/article.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('articles/:id')
  async getArticleById(id: string): Promise<Article> {
    return this.articleService.findById({ id });
  }
}
