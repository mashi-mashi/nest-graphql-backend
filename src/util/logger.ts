import { Logger, LoggerService, LogLevel } from '@nestjs/common';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import { safeStringify } from './safe-stringify';
import { Request } from 'express';

const maskFieldNames = ['password'];
const maskFields = (arg: any) => {
  const type = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
  if (type === 'object') {
    return Object.keys(arg).reduce<Record<string, any>>((acc, fieldName) => {
      if (maskFieldNames.includes(fieldName)) {
        acc[fieldName] = 'xxxxxxxxxxxxxxxxxxxxxx';
      } else {
        acc[fieldName] = maskFields(arg[fieldName]);
      }
      return acc;
    }, {});
  } else if (type === 'array') {
    return arg.map(maskFields);
  } else {
    return arg;
  }
};

export class CustomLogger implements LoggerService {
  private isLocal = false;
  setLocal = () => {
    this.isLocal = true;
  };

  private readonly traceId: string;
  private readonly requestInfo?: {
    ip?: string;
    url: string;
    method: string;
    headers: any;
    body: any;
    params: any;
    query: any;
    version?: string;
    userId?: string;
    personaId?: string;
  };

  private constructor(
    traceId: string = v4(),
    _requestInfo:
      | {
          ip?: string;
          url: string;
          method: string;
          headers?: any;
          body?: any;
          params?: any;
          query?: any;
          version?: string;
          userId?: string;
          personaId?: string;
        }
      | undefined,
  ) {
    this.traceId = traceId;
    if (_requestInfo)
      this.requestInfo = {
        ip: _requestInfo.ip,
        url: _requestInfo.url,
        method: _requestInfo.method,
        headers: _requestInfo.headers,
        body: _requestInfo.body,
        params: _requestInfo.params,
        query: _requestInfo.query,
        version: _requestInfo.version,
        userId: _requestInfo.userId,
        personaId: _requestInfo.personaId,
      };
  }

  public static getLogger() {
    return new CustomLogger(undefined, undefined);
  }

  public static getLoggerFromRequest(req: Request) {
    const context = (req as any).context;
    const traceId = context.traceId;
    const requestInfo = {
      ip: context.ip,
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: maskFields(req.body),
      params: req.params,
      query: req.query,
      version: context.version,
      serviceAccountId: context.serviceAccountId,
    };
    return new CustomLogger(traceId, requestInfo);
  }

  setLogLevels?(levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }

  public debug = (message: string, data?: Record<string, any>) => {
    if (this.isLocal) {
      this.out({
        message,
        data,
        severity: 'DEBUG',
      });
    }
  };
  public log = (message: string, data?: Record<string, any>) => {
    this.out({
      message,
      data,
      severity: 'INFO',
    });
  };
  public warn = (message: string, data?: Record<string, any>) => {
    this.out({
      message,
      data,
      severity: 'WARNING',
    });
  };
  public error = (message: string, data?: Record<string, any>) => {
    this.out({
      message,
      data,
      severity: 'ERROR',
    });
  };
  public fatal = (message: string, data?: Record<string, any>) => {
    this.out({
      message,
      data,
      severity: 'CRITICAL',
    });
  };

  private nativeLog = (...arg: any[]) => console.log(...arg);

  private out = (arg: {
    severity: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    message: string;
    data?: Record<string, any> | any[];
  }) => {
    const dataType = ValueUtil.getType(arg.data);
    const data =
      dataType === 'array' ? (arg.data as any[]).slice(0, 50) : arg.data;
    if (this.isLocal) {
      this.nativeLog({
        timestamp: DateTime.now()
          .setZone('Asia/Tokyo')
          .toFormat('yyyy/MM/dd HH:mm:ss.SSS'),
        severity: arg.severity,
        httpMethod: this.requestInfo?.method,
        url: this.requestInfo?.url,
        message: arg.message,
        query: this.requestInfo?.query,
        params: this.requestInfo?.params,
        body: safeStringify(this.requestInfo?.body),
        data: safeStringify(data),
      });
    } else {
      this.nativeLog(
        JSON.stringify({
          severity: arg.severity,
          'logging.googleapis.com/trace': `projects/${
            process.env.GCP_PROJECT ?? process.env.GCLOUD_PROJECT
          }/traces/${this.traceId}`,
          message: this.requestInfo
            ? `[${this.requestInfo.method}] [${this.requestInfo.url}] ${arg.message}`
            : `${arg.message}`,
          requestInfo: this.requestInfo,
          data: data ? safeStringify(data) : undefined,
        }),
      );
    }
  };
}

export class ObjectUtil {
  public static entries = <K extends string, T>(obj: {
    [Key in K]?: T;
  }) => {
    return Object.entries(obj) as [K, T][];
  };

  public static keys = <K extends string>(obj: Partial<Record<K, any>>) => {
    return Object.keys(obj) as K[];
  };

  public static values = <K extends string, T>(obj: Partial<Record<K, T>>) => {
    return Object.values(obj) as T[];
  };
}

type ValueType =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'number'
  | 'string'
  | 'object'
  | 'array'
  | 'function'
  | string;
const comparable = ['undefined', 'null', 'boolean', 'number', 'string'];

export class ValueUtil {
  public static getType = (val: any) =>
    Object.prototype.toString.call(val).slice(8, -1).toLowerCase() as ValueType;

  public static deepEquals = (val1: any, val2: any): boolean => {
    if (val1 === val2) {
      return true;
    }
    const val1Type = ValueUtil.getType(val1);
    const val2Type = ValueUtil.getType(val2);
    if (val1Type !== val2Type) {
      return false;
    }
    if (comparable.includes(val1Type)) {
      return val1 === val2;
    }
    if (val1Type === 'object' || val1Type === 'array') {
      return (
        ObjectUtil.keys(val1).every((k) =>
          ValueUtil.deepEquals(val1[k], val2[k]),
        ) &&
        ObjectUtil.keys(val2).every((k) =>
          ValueUtil.deepEquals(val1[k], val2[k]),
        )
      );
    }
    return false;
  };
}
