import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { NasaService } from './nasa.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [NasaService],
  exports: [NasaService],
})
export class NasaModule { } 