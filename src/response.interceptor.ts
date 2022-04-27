import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { deepTimestampToMillis } from './util/array-util';
import { safeStringify } from './util/safe-stringify';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        this.logger.log(`data=${safeStringify(data)}`);

        return Object.assign(
          {},
          {
            author: 'shima',
          },
          { data: deepTimestampToMillis(data) },
        );
      }),
    );
  }
}
