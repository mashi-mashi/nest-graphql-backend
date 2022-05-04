import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

dotenv.config(); // Load the environment variables

export const Env = {
  isLocal: process.env.IS_LOCAL,
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  const port = Number(Env.port) || 3000; // Cloud Run の要件。環境変数PORTで起動するように。

  !Env.isLocal && app.useLogger(app.get(Logger));

  await app.listen(port, '0.0.0.0'); // '0.0.0.0' を追加して外部からのアクセスを受け入れる。
}

bootstrap();
