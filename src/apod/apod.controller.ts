import { Controller, Get, Query } from '@nestjs/common';
import { ApodService } from './apod.service';

@Controller('apod')
export class ApodController {
  constructor(private readonly apodService: ApodService) { }

  @Get()
  async getApod(
    @Query('date') date?: string,
    @Query('count') count?: number,
  ) {
    return this.apodService.getApod(date, count ? Number(count) : undefined);
  }
} 