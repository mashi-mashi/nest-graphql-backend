import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

export class CustomLogger extends Logger {
  public override log = (message: string, data?: any) => {
    super.log({
      message,
      data: data,
    });
  };

  public override warn = (message: string, data?: any) => {
    super.warn({
      message,
      data,
    });
  };

  public override error = (message: string, data?: any) => {
    super.error({
      message,
      data,
    });
  };

  public override debug = (message: string, data?: any) => {
    super.debug({
      message,
      data,
    });
  };
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new CustomLogger(LoggerMiddleware.name);

  use(req: Request, _: Response, next: NextFunction) {
    req.id = req.id ?? v4();

    this.logger.log('middleware', {
      requestInfo: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        params: req.params,
        id: req.id,
      },
    });

    next();
  }
}
