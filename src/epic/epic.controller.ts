import { Controller, Get, Query } from '@nestjs/common';
import { EpicService } from './epic.service';

@Controller('epic')
export class EpicController {
  constructor(private readonly epicService: EpicService) { }

  @Get()
  async getEpic(@Query('date') date?: string) {
    return this.epicService.getEpic(date);
  }
} 