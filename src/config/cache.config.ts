import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '', 10) || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '', 10) || 0,
  tls: process.env.REDIS_TLS === 'true',
})); 