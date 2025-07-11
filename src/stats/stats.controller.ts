import { Controller, Get } from '@nestjs/common';
import { StatsService, StatsResponse } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) { }

  @Get()
  async getStats(): Promise<StatsResponse> {
    return this.statsService.getStats();
  }
} 