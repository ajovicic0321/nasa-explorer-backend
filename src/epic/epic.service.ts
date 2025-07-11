import { Injectable } from '@nestjs/common';
import { NasaService } from '../nasa/nasa.service';
import { CacheService } from '../cache/cache.service';

export interface EpicCoordinates {
  lat: number;
  lon: number;
}

export interface EpicPosition {
  x: number;
  y: number;
  z: number;
}

export interface EpicAttitudeQuaternions {
  q0: number;
  q1: number;
  q2: number;
  q3: number;
}

export interface EpicCoords {
  centroid_coordinates: EpicCoordinates;
  dscovr_j2000_position: EpicPosition;
  lunar_j2000_position: EpicPosition;
  sun_j2000_position: EpicPosition;
  attitude_quaternions: EpicAttitudeQuaternions;
}

export interface EpicResponse {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  centroid_coordinates: EpicCoordinates;
  dscovr_j2000_position: EpicPosition;
  lunar_j2000_position: EpicPosition;
  sun_j2000_position: EpicPosition;
  attitude_quaternions: EpicAttitudeQuaternions;
  date: string;
  coords: EpicCoords;
}

@Injectable()
export class EpicService {
  constructor(
    private readonly nasaService: NasaService,
    private readonly cacheService: CacheService,
  ) { }

  private getCacheKey(date?: string): string {
    return date ? `epic:date:${date}` : 'epic:recent';
  }

  async getEpic(date?: string): Promise<EpicResponse[]> {
    const cacheKey = this.getCacheKey(date);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const endpoint = date ? `/EPIC/api/natural/date/${date}` : '/EPIC/api/natural/recent';
    const data = await this.nasaService.makeNASARequest(endpoint);

    // Set TTL: 30 days for specific date, 1 hour for recent
    let ttl = 3600;
    if (date) ttl = 60 * 60 * 24 * 30;
    await this.cacheService.set(cacheKey, JSON.stringify(data), ttl);
    return data;
  }
} 