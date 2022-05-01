import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { v4 } from 'uuid';
import { ArticleModule } from './api/article/article.module';
import { UserModule } from './api/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphModule } from './gql/gql.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    UserModule,
    ArticleModule,
    GraphModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'debug',
        redact: ['request.headers.authorization'],
        genReqId: (req) => req.id ?? v4(),
        prettyPrint: {
          colorize: true,
          singleLine: true,
          levelFirst: false,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          messageFormat:
            '{req.headers.x-correlation-id} [{context}] [{req.id}] {msg}',
          ignore: 'pid,hostname,context,req,res,responseTime',
          errorLikeObjectKeys: ['err', 'error'],
        },
        autoLogging: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
