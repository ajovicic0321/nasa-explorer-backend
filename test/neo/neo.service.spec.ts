import { Test, TestingModule } from '@nestjs/testing';
import { NeoService, NeoFeedResponse } from '../../src/neo/neo.service';
import { NasaService } from '../../src/nasa/nasa.service';
import { CacheService } from '../../src/cache/cache.service';

describe('NeoService', () => {
  let service: NeoService;
  let nasaService: jest.Mocked<NasaService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NeoService,
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

    service = module.get<NeoService>(NeoService);
    nasaService = module.get(NasaService);
    cacheService = module.get(CacheService);
  });

  it('should return cached NEO feed if present', async () => {
    const cached: NeoFeedResponse = { links: { next: '', previous: '', self: '' }, element_count: 1, near_earth_objects: {} };
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getNeoFeed('2024-01-01', '2024-01-02');
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).not.toHaveBeenCalled();
  });

  it('should fetch NEO feed from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    const nasaResult: NeoFeedResponse = { links: { next: '', previous: '', self: '' }, element_count: 1, near_earth_objects: {} };
    nasaService.makeNASARequest.mockResolvedValueOnce(nasaResult);
    cacheService.set.mockResolvedValueOnce('OK');
    const result = await service.getNeoFeed('2024-01-01', '2024-01-02');
    expect(result).toEqual(nasaResult);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).toHaveBeenCalledWith('/neo/rest/v1/feed', { start_date: '2024-01-01', end_date: '2024-01-02' });
    expect(cacheService.set).toHaveBeenCalled();
  });
}); 