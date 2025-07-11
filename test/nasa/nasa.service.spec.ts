import { Test, TestingModule } from '@nestjs/testing';
import { NasaService } from '../../src/nasa/nasa.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';

describe('NasaService', () => {
  let service: NasaService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NasaService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'nasa.apiBaseUrl') return 'https://api.nasa.gov';
              if (key === 'nasa.apiKey') return 'DEMO_KEY';
              if (key === 'nasa.imagesApiBaseUrl') return 'https://images-api.nasa.gov';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<NasaService>(NasaService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigService);
  });

  it('should make a NASA API request with correct params', async () => {
    httpService.get.mockReturnValueOnce(of({ data: { result: 1 } } as any));
    const result = await service.makeNASARequest('/planetary/apod', { date: '2024-01-01' });
    expect(result).toEqual({ result: 1 });
    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.nasa.gov/planetary/apod',
      expect.objectContaining({ params: expect.objectContaining({ api_key: 'DEMO_KEY', date: '2024-01-01' }) })
    );
  });

  it('should make a NASA Images API request with correct params', async () => {
    httpService.get.mockReturnValueOnce(of({ data: { result: 2 } } as any));
    const result = await service.makeNASAImagesRequest('/search', { q: 'mars' });
    expect(result).toEqual({ result: 2 });
    expect(httpService.get).toHaveBeenCalledWith(
      'https://images-api.nasa.gov/search',
      expect.objectContaining({ params: { q: 'mars' } })
    );
  });

  it('should throw on NASA API error', async () => {
    httpService.get.mockReturnValueOnce(throwError(() => new Error('fail')));
    await expect(service.makeNASARequest('/fail')).rejects.toThrow('Failed to fetch data from NASA API: fail');
  });

  it('should throw on NASA Images API error', async () => {
    httpService.get.mockReturnValueOnce(throwError(() => new Error('fail2')));
    await expect(service.makeNASAImagesRequest('/fail')).rejects.toThrow('Failed to fetch data from NASA Images API: fail2');
  });
}); 