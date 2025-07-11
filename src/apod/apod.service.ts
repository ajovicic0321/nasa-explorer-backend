import { Injectable } from '@nestjs/common';
import { NasaService } from '../nasa/nasa.service';
import { CacheService } from '../cache/cache.service';

export interface APODResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

@Injectable()
export class ApodService {
  constructor(
    private readonly nasaService: NasaService,
    private readonly cacheService: CacheService,
  ) { }

  private getCacheKey(date?: string, count?: number): string {
    if (date && count) return `apod:date:${date}:count:${count}`;
    if (date) return `apod:date:${date}`;
    if (count) return `apod:count:${count}`;
    return 'apod:date:today';
  }

  async getApod(date?: string, count?: number): Promise<APODResponse | APODResponse[]> {
    const cacheKey = this.getCacheKey(date, count);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const params: Record<string, any> = {};
    if (date) params.date = date;
    if (count) params.count = count;
    const data = await this.nasaService.makeNASARequest('/planetary/apod', params);
    let ttl = 3600;
    if (date && !count) ttl = 60 * 60 * 24 * 30;
    await this.cacheService.set(cacheKey, JSON.stringify(data), ttl);
    return data;
  }
} 