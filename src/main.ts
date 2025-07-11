import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const origins = process.env.ORIGIN ? process.env.ORIGIN.split(',').map(o => o.trim()) : ['http://localhost:3000'];
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3003;

  app.enableCors({
    origin: origins,
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
