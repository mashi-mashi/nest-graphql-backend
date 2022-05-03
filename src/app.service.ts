import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  healthCheck(): string {
    this.logger.log('healthCheck');
    return 'success!';
  }
}
