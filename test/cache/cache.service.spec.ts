import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../../src/cache/cache.service';
import { ConfigService } from '@nestjs/config';

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockRedis),
  };
});

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  disconnect: jest.fn(),
};


describe('CacheService', () => {
  let service: CacheService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'cache.host') return 'localhost';
              if (key === 'cache.port') return 6379;
              if (key === 'cache.password') return '';
              if (key === 'cache.db') return 0;
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    configService = module.get(ConfigService);
    service.onModuleInit();
  });

  it('should get value from Redis', async () => {
    mockRedis.get.mockResolvedValueOnce('value');
    const result = await service.get('key');
    expect(result).toBe('value');
    expect(mockRedis.get).toHaveBeenCalledWith('key');
  });

  it('should set value in Redis', async () => {
    mockRedis.set.mockResolvedValueOnce('OK');
    const result = await service.set('key', 'value', 60);
    expect(result).toBe('OK');
    expect(mockRedis.set).toHaveBeenCalledWith('key', 'value', 'EX', 60);
  });

  it('should delete value from Redis', async () => {
    mockRedis.del.mockResolvedValueOnce(1);
    const result = await service.del('key');
    expect(result).toBe(1);
    expect(mockRedis.del).toHaveBeenCalledWith('key');
  });

  it('should disconnect on destroy', () => {
    service.onModuleDestroy();
    expect(mockRedis.disconnect).toHaveBeenCalled();
  });
}); 