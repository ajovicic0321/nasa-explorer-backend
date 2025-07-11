import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EpicController } from './epic.controller';
import { EpicService } from './epic.service';
import { CacheModule } from 'src/cache/cache.module';
import { NasaModule } from 'src/nasa/nasa.module';

@Module({
  imports: [HttpModule, ConfigModule, CacheModule, NasaModule],
  controllers: [EpicController],
  providers: [EpicService],
  exports: [EpicService],
})
export class EpicModule { } 