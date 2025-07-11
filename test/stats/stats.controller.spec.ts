import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../../src/stats/stats.controller';
import { StatsService, StatsResponse } from '../../src/stats/stats.service';

describe('StatsController', () => {
  let controller: StatsController;
  let service: jest.Mocked<StatsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: {
            getStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    service = module.get(StatsService);
  });

  it('should return stats from the service', async () => {
    const stats: StatsResponse = { totalMissions: 1, photosToday: 2, nearEarthObjects: 3, daysActive: 4 };
    service.getStats.mockResolvedValueOnce(stats);
    const result = await controller.getStats();
    expect(result).toEqual(stats);
    expect(service.getStats).toHaveBeenCalled();
  });
}); 