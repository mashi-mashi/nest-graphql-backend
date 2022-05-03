import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CustomLogger } from 'src/util/logger';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new CustomLogger(AuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      this.logger.warn('apiKey is not found.');
      return false;
    }

    return true;
  }
}
