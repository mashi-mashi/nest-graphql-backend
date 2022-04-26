import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    Logger.log(`${req.method} ${req.originalUrl}`, 'LoggerMiddleware');
    next();
  }
}
