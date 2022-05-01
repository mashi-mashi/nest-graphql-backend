import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { safeStringify } from './util/safe-stringify';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // Add request ID,so it can be tracked with response
    const requestId = uuidv4();

    // Graphql
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      // Express Response
      const res = gqlContext.getContext<{ res: Response }>().res;

      // Get user that sent request
      const userId = context.getArgByIndex(2).req?.user?.userId;
      const parentType = info.parentType.name;
      const fieldName = info.fieldName;

      const body = info.fieldNodes[0]?.loc?.source?.body;
      const message = `GraphQL - ${parentType} - ${fieldName}`;

      // Put to header, so can attach it to response as well
      res?.setHeader('requestId', requestId);

      return next.handle().pipe(
        map((data) => {
          this.log(
            'graphql',
            requestId,
            { ...data },
            {
              context: message,
              trace: {
                userId,
                body,
              },
            },
          );
          return data;
        }),
      );
    }

    return next.handle().pipe(
      map((data) => {
        this.log('http', requestId, data);

        return Object.assign(
          {
            requestId,
          },
          {
            data,
          },
        );
      }),
    );
  }

  private log(type: string, requestId: string, data: any, context?: any) {
    this.logger.log(
      `[${type}]requestId: ${requestId}, data=${safeStringify(
        data,
      )} context=${safeStringify(context)}`,
    );
  }
}
