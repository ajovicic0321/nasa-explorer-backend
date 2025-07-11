import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MarsController } from './mars.controller';
import { MarsService } from './mars.service';
import { CacheModule } from 'src/cache/cache.module';
import { NasaModule } from 'src/nasa/nasa.module';

@Module({
  imports: [HttpModule, ConfigModule, CacheModule, NasaModule],
  controllers: [MarsController],
  providers: [MarsService],
  exports: [MarsService],
})
export class MarsModule { } 