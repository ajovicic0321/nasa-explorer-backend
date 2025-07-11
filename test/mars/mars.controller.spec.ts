import { Test, TestingModule } from '@nestjs/testing';
import { MarsController } from '../../src/mars/mars.controller';
import { MarsService, MarsPhotosResponse, MarsRover } from '../../src/mars/mars.service';

describe('MarsController', () => {
  let controller: MarsController;
  let service: jest.Mocked<MarsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarsController],
      providers: [
        {
          provide: MarsService,
          useValue: {
            getMarsPhotos: jest.fn(),
            getMarsRovers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MarsController>(MarsController);
    service = module.get(MarsService);
  });

  it('should return Mars photos from the service', async () => {
    const photos: MarsPhotosResponse = { photos: [] };
    service.getMarsPhotos.mockResolvedValueOnce(photos);
    const result = await controller.getMarsPhotos('1000', 'curiosity', undefined, undefined, 1);
    expect(result).toEqual(photos);
    expect(service.getMarsPhotos).toHaveBeenCalledWith({ rover: 'curiosity', sol: '1000', earth_date: undefined, camera: undefined, page: 1 });
  });

  it('should return Mars rovers from the service', async () => {
    const rovers: MarsRover[] = [];
    service.getMarsRovers.mockResolvedValueOnce(rovers);
    const result = await controller.getMarsRovers();
    expect(result).toEqual(rovers);
    expect(service.getMarsRovers).toHaveBeenCalled();
  });
}); 