import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { CustomLogger } from './logger';

export const getRequest = (context: ExecutionContext): Request => {
  if (context.getType<GqlContextType>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<{ req: Request }>().req;
  } else {
    return context.switchToHttp().getRequest();
  }
};

export const getResponse = (context: ExecutionContext): Response => {
  if (context.getType<GqlContextType>() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext<{ res: Response }>().res;
  } else {
    return context.switchToHttp().getResponse();
  }
};

export const sendResponse = async <T>(
  func: (body?: any) => Promise<T> | T,
  { logger = new CustomLogger('createResponse') },
) => {
  try {
    return await func();
  } catch (e) {
    const { message, status } = e;

    logger.error(`Error: ${message}`, e);

    throw new HttpException(
      {
        status: status || HttpStatus.INTERNAL_SERVER_ERROR,
        error: message || 'Internal server error',
        // detail: JSON.stringify(detail),
      },
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export class HttpError extends HttpException {
  constructor({
    message,
    status,
    detail,
  }: {
    message: string;
    status?: number;
    detail?: any;
  }) {
    super(
      { message, status, detail },
      status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
