import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ArticleModule } from './api/article/article.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PrismaService } from './prisma.service';
import { GraphModule } from './gql/gql.module';

@Module({
  imports: [UserModule, ArticleModule, GraphModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
