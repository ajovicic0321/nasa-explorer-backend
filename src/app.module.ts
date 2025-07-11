import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import nasaConfig from './config/nasa.config';
import cacheConfig from './config/cache.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { CacheModule } from './cache/cache.module';
import { ApodModule } from './apod/apod.module';
import { NasaModule } from './nasa/nasa.module';
import { EpicModule } from './epic/epic.module';
import { MarsModule } from './mars/mars.module';
import { NeoModule } from './neo/neo.module';
import { SearchModule } from './search/search.module';
import { StatsModule } from './stats/stats.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [nasaConfig, cacheConfig],
    }),
    ApodModule,
    NasaModule,
    EpicModule,
    MarsModule,
    NeoModule,
    CacheModule,
    SearchModule,
    StatsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(RateLimitMiddleware)
      .forRoutes('*');
  }
}
