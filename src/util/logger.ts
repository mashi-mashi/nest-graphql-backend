import { Logger } from '@nestjs/common';

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
