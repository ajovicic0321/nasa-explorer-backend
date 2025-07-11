import { Module } from '@nestjs/common';
import { NasaModule } from '../nasa/nasa.module';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [NasaModule, CacheModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule { } 