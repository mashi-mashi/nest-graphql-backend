import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getRequest } from 'src/util/api-util';
import { CustomLogger } from 'src/util/logger';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new CustomLogger(AuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = getRequest(context);

    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      this.logger.warn('apiKey is not found.');
      return false;
    }

    return true;
  }
}
