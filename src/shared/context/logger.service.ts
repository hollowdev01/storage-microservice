import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LogsService {
  constructor(private readonly logger: Logger) {}

  logInfo(message: string, meta?: any) {
    this.logger.log({ ...meta }, message);
  }

  logError(message: string, error?: Error, meta?: any) {
    this.logger.error({ ...meta, error: error?.stack }, message);
  }

  logWarn(message: string, meta?: any) {
    this.logger.warn({ ...meta }, message);
  }

  logDebug(message: string, meta?: any) {
    this.logger.debug({ ...meta }, message);
  }
}
