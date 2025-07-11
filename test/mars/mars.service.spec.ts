import { Test, TestingModule } from '@nestjs/testing';
import { MarsService, MarsPhotosResponse, MarsRover } from '../../src/mars/mars.service';
import { NasaService } from '../../src/nasa/nasa.service';
import { CacheService } from '../../src/cache/cache.service';

describe('MarsService', () => {
  let service: MarsService;
  let nasaService: jest.Mocked<NasaService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarsService,
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

    service = module.get<MarsService>(MarsService);
    nasaService = module.get(NasaService);
    cacheService = module.get(CacheService);
  });

  it('should return cached Mars photos if present', async () => {
    const cached: MarsPhotosResponse = { photos: [{ id: 1, sol: 1000, camera: { id: 1, name: 'FHAZ', rover_id: 1, full_name: 'Front Hazard Avoidance Camera' }, img_src: 'http://test', earth_date: '2015-05-30', rover: { id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' } }] };
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getMarsPhotos({ rover: 'curiosity', sol: '1000' });
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).not.toHaveBeenCalled();
  });

  it('should fetch Mars photos from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    const nasaResult: MarsPhotosResponse = { photos: [{ id: 1, sol: 1000, camera: { id: 1, name: 'FHAZ', rover_id: 1, full_name: 'Front Hazard Avoidance Camera' }, img_src: 'http://test', earth_date: '2015-05-30', rover: { id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' } }] };
    nasaService.makeNASARequest.mockResolvedValueOnce(nasaResult);
    cacheService.set.mockResolvedValueOnce('OK');
    const result = await service.getMarsPhotos({ rover: 'curiosity', sol: '1000' });
    expect(result).toEqual(nasaResult);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).toHaveBeenCalledWith('/mars-photos/api/v1/rovers/curiosity/photos', { page: 1, sol: '1000' });
    expect(cacheService.set).toHaveBeenCalled();
  });

  it('should return cached Mars rovers if present', async () => {
    const cached: MarsRover[] = [{ id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active', max_sol: 1000, max_date: '2025-07-08', total_photos: 100, cameras: [] }];
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getMarsRovers();
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).not.toHaveBeenCalledWith('/mars-photos/api/v1/rovers');
  });

  it('should fetch Mars rovers from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    const nasaResult: MarsRover[] = [{ id: 1, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active', max_sol: 1000, max_date: '2025-07-08', total_photos: 100, cameras: [] }];
    nasaService.makeNASARequest.mockResolvedValueOnce(nasaResult);
    cacheService.set.mockResolvedValueOnce('OK');
    const result = await service.getMarsRovers();
    expect(result).toEqual(nasaResult);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASARequest).toHaveBeenCalledWith('/mars-photos/api/v1/rovers');
    expect(cacheService.set).toHaveBeenCalled();
  });
}); 