import { Test, TestingModule } from '@nestjs/testing';
import { NeoController } from '../../src/neo/neo.controller';
import { NeoService, NeoFeedResponse } from '../../src/neo/neo.service';

describe('NeoController', () => {
  let controller: NeoController;
  let service: jest.Mocked<NeoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeoController],
      providers: [
        {
          provide: NeoService,
          useValue: {
            getNeoFeed: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NeoController>(NeoController);
    service = module.get(NeoService);
  });

  it('should return NEO feed from the service', async () => {
    const neo: NeoFeedResponse = { links: { next: '', previous: '', self: '' }, element_count: 1, near_earth_objects: {} };
    service.getNeoFeed.mockResolvedValueOnce(neo);
    const result = await controller.getNeoFeed('2024-01-01', '2024-01-02');
    expect(result).toEqual(neo);
    expect(service.getNeoFeed).toHaveBeenCalledWith('2024-01-01', '2024-01-02');
  });

  it('should call service with undefined params if not provided', async () => {
    service.getNeoFeed.mockResolvedValueOnce({ links: { next: '', previous: '', self: '' }, element_count: 0, near_earth_objects: {} });
    await controller.getNeoFeed(undefined, undefined);
    expect(service.getNeoFeed).toHaveBeenCalledWith(undefined, undefined);
  });
}); 