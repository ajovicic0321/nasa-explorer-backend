import { Test, TestingModule } from '@nestjs/testing';
import { ApodService, APODResponse } from '../../src/apod/apod.service';
import { NasaService } from '../../src/nasa/nasa.service';
import { CacheService } from '../../src/cache/cache.service';

describe('ApodService', () => {
  let service: ApodService;
  let nasaService: jest.Mocked<NasaService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApodService,
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

    service = module.get<ApodService>(ApodService);
    nasaService = module.get(NasaService);
    cacheService = module.get(CacheService);
  });

  it('should return cached APOD if present', async () => {
    const cached: APODResponse = { date: '2024-01-01', explanation: 'test', media_type: 'image', service_version: 'v1', title: 'Test', url: 'http://test', hdurl: 'http://test/hd' };
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getApod('2024-01-01');
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).not.toHaveBeenCalled();
  });

  it('should fetch from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    const nasaResult: APODResponse = { date: '2024-01-01', explanation: 'test', media_type: 'image', service_version: 'v1', title: 'Test', url: 'http://test', hdurl: 'http://test/hd' };
    nasaService.makeNASARequest.mockResolvedValueOnce(nasaResult);
    cacheService.set.mockResolvedValueOnce('OK');
    const result = await service.getApod('2024-01-01');
    expect(result).toEqual(nasaResult);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).toHaveBeenCalledWith('/planetary/apod', { date: '2024-01-01' });
    expect(cacheService.set).toHaveBeenCalled();
  });
}); 