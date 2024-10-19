import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';

import { LogsService } from './logger.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
    private readonly logsService: LogsService,
  ) {}

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const cache = await this.cacheManager.set(key, value, ttl);
      this.logsService.logInfo(
        `Value cached: ${key} with TTL of ${ttl} seconds`,
      );
      return cache;
    } catch (error) {
      this.logsService.logError(
        `Error save in cache error:${error} key:${key} ${new Date().toISOString()}`,
      );
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    if (value !== undefined) {
      this.logsService.logInfo(`Value retrieved from cache: ${key}`);
    } else {
      this.logsService.logWarn(`Value not found in cache: ${key}`);
    }
    return value;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logsService.logInfo(`Value deleted from cache: ${key}`);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.cacheManager.get(key);
    const exists = value !== undefined;
    this.logsService.logInfo(
      `Cache existence check: ${key} - ${exists ? 'exists' : 'does not exist'}`,
    );
    return exists;
  }
}
