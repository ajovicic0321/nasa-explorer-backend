import { Injectable } from '@nestjs/common';
import { NasaService } from '../nasa/nasa.service';
import { CacheService } from '../cache/cache.service';

export interface StatsResponse {
  totalMissions: number;
  photosToday: number;
  nearEarthObjects: number;
  daysActive: number;
}

@Injectable()
export class StatsService {
  constructor(
    private readonly nasaService: NasaService,
    private readonly cacheService: CacheService,
  ) { }

  async getStats(): Promise<StatsResponse> {
    const cacheKey = 'stats:home';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get Mars rovers data for mission count
    const roversData = await this.nasaService.makeNASARequest('/mars-photos/api/v1/rovers');
    const activeMissions = roversData.rovers ? roversData.rovers.length : 0;

    // Get recent photos count from Mars rovers
    const recentPhotos = await this.nasaService.makeNASARequest('/mars-photos/api/v1/rovers/curiosity/photos', {
      sol: 4000,
      page: 1,
    });
    const photosCount = recentPhotos.photos ? recentPhotos.photos.length : 0;

    // Get Near Earth Objects count for today
    const today = new Date().toISOString().split('T')[0];
    const neoData = await this.nasaService.makeNASARequest('/neo/rest/v1/feed', {
      start_date: today,
      end_date: today,
    });
    const neoCount = neoData.near_earth_objects && neoData.near_earth_objects[today]
      ? neoData.near_earth_objects[today].length : 0;

    // Calculate days since NASA was founded (July 29, 1958)
    const nasaFoundingDate = new Date('1958-07-29');
    const currentDate = new Date();
    const daysSinceNasaFounded = Math.floor((currentDate.getTime() - nasaFoundingDate.getTime()) / (1000 * 60 * 60 * 24));

    const stats: StatsResponse = {
      // Add base historical missions
      totalMissions: activeMissions + 138,
      photosToday: photosCount,
      nearEarthObjects: neoCount,
      daysActive: daysSinceNasaFounded,
    };

    await this.cacheService.set(cacheKey, JSON.stringify(stats), 3600);
    return stats;
  }
} 