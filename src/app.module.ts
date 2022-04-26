import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleService } from './article/article.service';
import { ArticleModule } from './article/article.module';
import { PrismaService } from './prisma.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ArticleController } from './article/article.controller';

@Module({
  imports: [UserModule, ArticleModule],
  controllers: [AppController, ArticleController],
  providers: [AppService, ArticleService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
