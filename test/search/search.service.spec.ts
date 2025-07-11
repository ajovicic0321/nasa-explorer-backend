import { Test, TestingModule } from '@nestjs/testing';
import { SearchService, NasaImageSearchResponse, NewsItem } from '../../src/search/search.service';
import { NasaService } from '../../src/nasa/nasa.service';
import { CacheService } from '../../src/cache/cache.service';

describe('SearchService', () => {
  let service: SearchService;
  let nasaService: jest.Mocked<NasaService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: NasaService,
          useValue: { makeNASAImagesRequest: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    nasaService = module.get(NasaService);
    cacheService = module.get(CacheService);
  });

  it('should return cached search results if present', async () => {
    const cached: NasaImageSearchResponse = { collection: { version: '1.1', href: '', items: [] } };
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.search('test', 1);
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASAImagesRequest).not.toHaveBeenCalled();
  });

  it('should fetch search results from NASA and cache if not cached', async () => {
    cacheService.get.mockResolvedValueOnce(null);
    const nasaResult: NasaImageSearchResponse = { collection: { version: '1.1', href: '', items: [] } };
    nasaService.makeNASAImagesRequest.mockResolvedValueOnce(nasaResult);
    cacheService.set.mockResolvedValueOnce('OK');
    const result = await service.search('test', 1);
    expect(result).toEqual(nasaResult);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASAImagesRequest).toHaveBeenCalledWith('/search', { q: 'test', page: 1 });
    expect(cacheService.set).toHaveBeenCalled();
  });

  it('should return cached news if present', async () => {
    const cached: NewsItem[] = [{ title: 't', description: 'd', date: '2024', category: 'C', nasa_id: 'id', center: 'c', keywords: [], media_type: 'image' }];
    cacheService.get.mockResolvedValueOnce(JSON.stringify(cached));
    const result = await service.getNews();
    expect(result).toEqual(cached);
    expect(cacheService.get).toHaveBeenCalled();
    expect(nasaService.makeNASAImagesRequest).not.toHaveBeenCalled();
  });
}); 