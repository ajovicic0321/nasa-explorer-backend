import { Module } from '@nestjs/common';
import { NasaModule } from '../nasa/nasa.module';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [NasaModule, CacheModule],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule { } 