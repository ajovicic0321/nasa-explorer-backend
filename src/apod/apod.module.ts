import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ApodService } from './apod.service';
import { ApodController } from './apod.controller';
import { NasaModule } from 'src/nasa/nasa.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [HttpModule, ConfigModule, NasaModule, CacheModule],
  controllers: [ApodController],
  providers: [ApodService],
  exports: [ApodService],
})
export class ApodModule { } 