import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import * as dotenv from 'dotenv';

dotenv.config(); // Load the environment variables
console.log(`The connection URL is ${process.env.DATABASE_URL}`);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = Number(process.env.PORT) || 3000; // Cloud Run の要件。環境変数PORTで起動するように。

  !process.env.IS_LOCAL && app.useLogger(app.get(Logger));

  await app.listen(port, '0.0.0.0'); // '0.0.0.0' を追加して外部からのアクセスを受け入れる。
}

bootstrap();
