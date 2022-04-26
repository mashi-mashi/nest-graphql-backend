import { Controller, Get } from '@nestjs/common';

@Controller('articles')
export class ArticleController {
  @Get()
  getHello(): string {
    return 'Hello World! article';
  }
}
