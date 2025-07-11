import { Test, TestingModule } from '@nestjs/testing';
import { EpicService, EpicResponse } from '../../src/epic/epic.service';
import { NasaService } from '../../src/nasa/nasa.service';
import { CacheService } from '../../src/cache/cache.service';

describe('EpicService', () => {
  let service: EpicService;
  let nasaService: jest.Mocked<NasaService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpicService,
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

    service = module.get<EpicService>(EpicService);
    nasaService = module.get(NasaService);
    cacheService = module.get(CacheService);
  });

  it('should return cached EPIC data if present', async () => {
    const cached: EpicResponse[] = [{ identifier: 'id', caption: 'caption', image: 'img', version: 'v1', centroid_coordinates: { lat: 0, lon: 0 }, dscovr_j2000_position: { x: 0, y: 0, z: 0 }, lunar_j2000_position: { x: 0, y: 0, z: 0 }, sun_j2000_position: { x: 0, y: 0, z: 0 }, attitude_quaternions: { q0: 0, q1: 0, q2: 0, q3: 0 }, date: '2024-01-01', coords: { centroid_coordinates: { lat: 0, lon: 0 }, dscovr_j2000_position: { x: 0, y: 0, z: 0 }, lunar_j2000_position: { x: 0, y: 0, z: 0 }, sun_j2000_position: { x: 0, y: 0, z: 0 }, attitude_quaternions: { q0: 0, q1: 0, q2: 0, q3: 0 } } }];
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getEpic('2024-01-01');
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).not.toHaveBeenCalled();
  });

  it('should fetch EPIC data from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    const nasaResult: EpicResponse[] = [{ identifier: 'id', caption: 'caption', image: 'img', version: 'v1', centroid_coordinates: { lat: 0, lon: 0 }, dscovr_j2000_position: { x: 0, y: 0, z: 0 }, lunar_j2000_position: { x: 0, y: 0, z: 0 }, sun_j2000_position: { x: 0, y: 0, z: 0 }, attitude_quaternions: { q0: 0, q1: 0, q2: 0, q3: 0 }, date: '2024-01-01', coords: { centroid_coordinates: { lat: 0, lon: 0 }, dscovr_j2000_position: { x: 0, y: 0, z: 0 }, lunar_j2000_position: { x: 0, y: 0, z: 0 }, sun_j2000_position: { x: 0, y: 0, z: 0 }, attitude_quaternions: { q0: 0, q1: 0, q2: 0, q3: 0 } } }];
    nasaService.makeNASARequest.mockResolvedValueOnce(nasaResult);
    cacheService.set.mockResolvedValueOnce('OK');
    const result = await service.getEpic('2024-01-01');
    expect(result).toEqual(nasaResult);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).toHaveBeenCalledWith('/EPIC/api/natural/date/2024-01-01');
    expect(cacheService.set).toHaveBeenCalled();
  });
}); 