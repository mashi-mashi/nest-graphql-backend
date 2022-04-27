import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { ArticleService } from './api/article/article.service';
import { ArticleModule } from './api/article/article.module';
import { PrismaService } from './prisma.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ArticleController } from './api/article/article.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ParseOgpUsecase } from './usecase/parse-ogp.usecase';

@Module({
  imports: [UserModule, ArticleModule, ScheduleModule.forRoot()],
  controllers: [AppController, ArticleController],
  providers: [AppService, ArticleService, PrismaService, ParseOgpUsecase],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
