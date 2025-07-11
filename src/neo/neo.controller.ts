import { Controller, Get, Query } from '@nestjs/common';
import { NeoService } from './neo.service';

@Controller('neo')
export class NeoController {
  constructor(private readonly neoService: NeoService) { }

  @Get()
  async getNeoFeed(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.neoService.getNeoFeed(start_date, end_date);
  }
} 