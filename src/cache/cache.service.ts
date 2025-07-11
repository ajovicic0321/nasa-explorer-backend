import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) { }

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get('cache.host'),
      port: this.configService.get('cache.port'),
      password: this.configService.get('cache.password'),
      db: this.configService.get('cache.db'),
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<'OK' | null> {
    if (expireSeconds) {
      return this.client.set(key, value, 'EX', expireSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
