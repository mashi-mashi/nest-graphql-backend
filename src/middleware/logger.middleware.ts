import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { v4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, _: Response, next: NextFunction) {
    req.id = req.id ?? v4();
    this.logger.log(`[${req.method}]${req.originalUrl} RequestId=${req.id} `);

    next();
  }
}
