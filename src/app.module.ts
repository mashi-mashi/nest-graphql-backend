import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { v4 } from 'uuid';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { PrismaService } from './common/prisma.service';
import { GraphModule } from './gql/gql.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserModule } from './user/user.module';

const SeverityLookup = {
  default: 'DEFAULT',
  silly: 'DEFAULT',
  verbose: 'DEBUG',
  debug: 'DEBUG',
  http: 'notice',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
};

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
        prettyPrint: process.env.IS_LOCAL
          ? {
              colorize: true,
              singleLine: true,
              levelFirst: false,
              translateTime: 'yyyy-mm-dd HH:MM:ss.l',
              messageFormat:
                '{req.headers.x-correlation-id} [{context}] [{req.id}] {message}',
              ignore: 'pid,hostname,context,req,res,responseTime',
              errorLikeObjectKeys: ['err', 'error'],
            }
          : null,
        autoLogging: false,
        formatters: {
          level(label: string, number: number) {
            return {
              severity: SeverityLookup[label] || SeverityLookup['info'],
              level: number,
            };
          },
          log(payload: any) {
            return {
              context: payload.context,
              message: payload.message,
              data: payload.data,
              // requestId: payload?.req?.id,
            };
          },
        },
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
