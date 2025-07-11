import { Module } from '@nestjs/common';
import { NasaModule } from '../nasa/nasa.module';
import { NeoService } from './neo.service';
import { NeoController } from './neo.controller';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [NasaModule, CacheModule],
  controllers: [NeoController],
  providers: [NeoService],
  exports: [NeoService],
})
export class NeoModule { } 