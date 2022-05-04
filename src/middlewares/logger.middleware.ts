import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Env } from 'src/main';
import { CustomLogger } from 'src/util/logger';
import { v4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger(LoggerMiddleware.name);

  use(req: Request, _: Response, next: NextFunction) {
    req.id = req.id ?? v4();

    this.logger.log(`[${req.method}]${req.url} request`, {
      requestInfo: !Env.isLocal
        ? {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: { ...req.body, query: req.body?.query },
            params: req.params || {},
            id: req.id,
          }
        : {
            message: 'Local',
          },
    });

    next();
  }
}
