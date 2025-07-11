import { Injectable } from '@nestjs/common';
import { NasaService } from '../nasa/nasa.service';
import { CacheService } from '../cache/cache.service';

export interface NeoFeedLinks {
  next: string;
  previous: string;
  self: string;
}

export interface NeoEstimatedDiameterUnit {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface NeoEstimatedDiameter {
  kilometers: NeoEstimatedDiameterUnit;
  meters: NeoEstimatedDiameterUnit;
  miles: NeoEstimatedDiameterUnit;
  feet: NeoEstimatedDiameterUnit;
}

export interface NeoRelativeVelocity {
  kilometers_per_second: string;
  kilometers_per_hour: string;
  miles_per_hour: string;
}

export interface NeoMissDistance {
  astronomical: string;
  lunar: string;
  kilometers: string;
  miles: string;
}

export interface NeoCloseApproachData {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: NeoRelativeVelocity;
  miss_distance: NeoMissDistance;
  orbiting_body: string;
}

export interface NeoObjectLinks {
  self: string;
}

export interface NeoObject {
  links: NeoObjectLinks;
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: NeoEstimatedDiameter;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: NeoCloseApproachData[];
  is_sentry_object: boolean;
  sentry_data?: string;
}

export interface NeoFeedResponse {
  links: NeoFeedLinks;
  element_count: number;
  near_earth_objects: {
    [date: string]: NeoObject[];
  };
}

@Injectable()
export class NeoService {
  constructor(
    private readonly nasaService: NasaService,
    private readonly redisService: CacheService,
  ) { }

  private getCacheKey(start_date?: string, end_date?: string): string {
    if (start_date && end_date) return `neo:start:${start_date}:end:${end_date}`;
    if (start_date) return `neo:start:${start_date}`;
    if (end_date) return `neo:end:${end_date}`;
    return 'neo:today';
  }

  async getNeoFeed(start_date?: string, end_date?: string): Promise<NeoFeedResponse> {
    const cacheKey = this.getCacheKey(start_date, end_date);
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const params: Record<string, any> = {};
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    const data = await this.nasaService.makeNASARequest('/neo/rest/v1/feed', params);
    await this.redisService.set(cacheKey, JSON.stringify(data), 60 * 60 * 24);
    return data;
  }
} 