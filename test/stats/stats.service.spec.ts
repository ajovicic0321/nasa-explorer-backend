import { Test, TestingModule } from '@nestjs/testing';
import { StatsService, StatsResponse } from '../../src/stats/stats.service';
import { NasaService } from '../../src/nasa/nasa.service';
import { CacheService } from '../../src/cache/cache.service';

describe('StatsService', () => {
  let service: StatsService;
  let nasaService: jest.Mocked<NasaService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: NasaService,
          useValue: { makeNASARequest: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    nasaService = module.get(NasaService);
    cacheService = module.get(CacheService);
  });

  it('should return cached stats if present', async () => {
    const cached: StatsResponse = { totalMissions: 1, photosToday: 2, nearEarthObjects: 3, daysActive: 4 };
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getStats();
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).not.toHaveBeenCalled();
  });

  it('should fetch stats from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    nasaService.makeNASARequest
      .mockResolvedValueOnce({ rovers: [1, 2, 3] })
      .mockResolvedValueOnce({ photos: [1, 2] })
      .mockResolvedValueOnce({ near_earth_objects: { '2024-01-01': [1, 2, 3] } });
    cacheService.set.mockResolvedValueOnce('OK');
    const RealDate = Date;
    jest.spyOn(global, 'Date').mockImplementation(() => new RealDate('2024-01-01T00:00:00Z') as any);
    const result = await service.getStats();
    expect(result.totalMissions).toBe(3 + 138);
    expect(result.photosToday).toBe(2);
    expect(result.nearEarthObjects).toBe(3);
    expect(result.daysActive).toBe(0);
    expect(cacheService.set).toHaveBeenCalled();
    (global.Date as any).mockRestore();
  });
}); 