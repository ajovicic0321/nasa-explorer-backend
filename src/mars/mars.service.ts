import { Injectable } from '@nestjs/common';
import { NasaService } from '../nasa/nasa.service';
import { CacheService } from '../cache/cache.service';

export interface MarsCamera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface MarsRover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: MarsCamera[];
}

export interface MarsPhoto {
  id: number;
  sol: number;
  camera: MarsCamera;
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsPhotosResponse {
  photos: MarsPhoto[];
}

@Injectable()
export class MarsService {
  constructor(
    private readonly nasaService: NasaService,
    private readonly cacheService: CacheService,
  ) { }

  private getPhotosCacheKey(rover: string, sol?: string, earth_date?: string, camera?: string, page?: number): string {
    return `mars:photos:${rover || 'curiosity'}:${sol || ''}:${earth_date || ''}:${camera || ''}:${page || 1}`;
  }

  async getMarsPhotos(params: { rover?: string; sol?: string; earth_date?: string; camera?: string; page?: number }): Promise<MarsPhotosResponse> {
    const { rover = 'curiosity', sol, earth_date, camera, page = 1 } = params;
    const cacheKey = this.getPhotosCacheKey(rover, sol, earth_date, camera, page);
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const query: Record<string, any> = { page };
    if (sol) query.sol = sol;
    if (earth_date) query.earth_date = earth_date;
    if (camera) query.camera = camera;
    const data = await this.nasaService.makeNASARequest(`/mars-photos/api/v1/rovers/${rover}/photos`, query);
    const ttl = 60 * 60 * 24;
    await this.cacheService.set(cacheKey, JSON.stringify(data), ttl);
    return data;
  }

  async getMarsRovers(): Promise<MarsRover[]> {
    const cacheKey = 'mars:rovers';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const data = await this.nasaService.makeNASARequest('/mars-photos/api/v1/rovers');
    await this.cacheService.set(cacheKey, JSON.stringify(data), 60 * 60 * 24 * 7);
    return data;
  }
} 