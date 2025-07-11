import { Controller, Get, Query } from '@nestjs/common';
import { MarsService } from './mars.service';

@Controller()
export class MarsController {
  constructor(private readonly marsService: MarsService) { }

  @Get('mars-photos')
  async getMarsPhotos(
    @Query('sol') sol: string,
    @Query('rover') rover?: string,
    @Query('earth_date') earth_date?: string,
    @Query('camera') camera?: string,
    @Query('page') page?: number,
  ) {
    return this.marsService.getMarsPhotos({ rover, sol, earth_date, camera, page: page ? Number(page) : 1 });
  }

  @Get('mars-rovers')
  async getMarsRovers() {
    return this.marsService.getMarsRovers();
  }
} 