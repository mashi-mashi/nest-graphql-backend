import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomLogger } from './logger';

export const response = async <T>(
  func: (body?: any) => Promise<T> | T,
  { logger = new CustomLogger('createResponse') },
) => {
  try {
    return await func();
  } catch (e) {
    const { message, status, detail } = e;

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
