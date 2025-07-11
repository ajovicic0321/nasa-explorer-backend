import { registerAs } from '@nestjs/config';

export default registerAs('nasa', () => ({
  apiBaseUrl: process.env.NASA_API_BASE_URL || 'https://api.nasa.gov',
  imagesApiBaseUrl: process.env.NASA_IMAGES_API_BASE_URL || 'https://images-api.nasa.gov',
  apiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
})); 