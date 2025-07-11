import { Test, TestingModule } from '@nestjs/testing';
import { EpicController } from '../../src/epic/epic.controller';
import { EpicService, EpicResponse } from '../../src/epic/epic.service';

describe('EpicController', () => {
  let controller: EpicController;
  let service: jest.Mocked<EpicService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpicController],
      providers: [
        {
          provide: EpicService,
          useValue: {
            getEpic: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EpicController>(EpicController);
    service = module.get(EpicService);
  });

  it('should return EPIC data from the service', async () => {
    const epic: EpicResponse[] = [];
    service.getEpic.mockResolvedValueOnce(epic);
    const result = await controller.getEpic('2024-01-01');
    expect(result).toEqual(epic);
    expect(service.getEpic).toHaveBeenCalledWith('2024-01-01');
  });

  it('should call service with undefined date if not provided', async () => {
    service.getEpic.mockResolvedValueOnce([]);
    await controller.getEpic(undefined);
    expect(service.getEpic).toHaveBeenCalledWith(undefined);
  });
}); 