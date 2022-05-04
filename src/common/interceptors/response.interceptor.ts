import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { CustomLogger } from '../../util/logger';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new CustomLogger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // Add request ID,so it can be tracked with response

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

      return next.handle().pipe(
        map((data) => {
          this.log(
            'graphql',
            { ...data },
            {
              context: message,
              trace: {
                userId,
                body:
                  typeof body === 'string' ? body.replace(/\n/g, ' ') : body,
              },
            },
          );
          return data;
        }),
      );
    }

    return next.handle().pipe(
      map((data) => {
        this.log('http', data);

        return Object.assign(
          {
            author: 'NestJS',
            statusCode: 200,
          },
          {
            data,
          },
        );
      }),
    );
  }

  private log(type: string, data: any, context?: any) {
    this.logger.log('response', {
      type,
      response: data,
      reqContext: context,
    });
  }
}
