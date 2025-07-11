import { Test, TestingModule } from '@nestjs/testing';
import { ApodController } from '../../src/apod/apod.controller';
import { ApodService, APODResponse } from '../../src/apod/apod.service';

describe('ApodController', () => {
  let controller: ApodController;
  let service: jest.Mocked<ApodService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApodController],
      providers: [
        {
          provide: ApodService,
          useValue: {
            getApod: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApodController>(ApodController);
    service = module.get(ApodService);
  });

  it('should return APOD data from the service', async () => {
    const apod: APODResponse = {
      date: '2024-01-01',
      explanation: 'test',
      media_type: 'image',
      service_version: 'v1',
      title: 'Test',
      url: 'http://test',
      hdurl: 'http://test/hd',
    };
    service.getApod.mockResolvedValueOnce(apod);

    const result = await controller.getApod('2024-01-01');
    expect(result).toEqual(apod);
    expect(service.getApod).toHaveBeenCalledWith('2024-01-01', undefined);
  });

  it('should pass count param to the service', async () => {
    service.getApod.mockResolvedValueOnce([] as APODResponse[]);
    await controller.getApod(undefined, 3);
    expect(service.getApod).toHaveBeenCalledWith(undefined, 3);
  });
}); 