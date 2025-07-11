import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NasaService {
  private readonly logger = new Logger(NasaService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }

  async makeNASARequest(endpoint: string, params: Record<string, any> = {}, baseUrl?: string): Promise<any> {
    const apiBaseUrl = baseUrl || this.configService.get<string>('nasa.apiBaseUrl');
    const apiKey = this.configService.get<string>('nasa.apiKey');
    const url = `${apiBaseUrl}${endpoint}`;
    try {
      this.logger.log(`NASA API Request: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { ...params, api_key: apiKey },
          timeout: 10000,
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`NASA API Error for ${endpoint}: ${error.message}`);
      throw new Error(`Failed to fetch data from NASA API: ${error.message}`);
    }
  }

  async makeNASAImagesRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const imagesApiBaseUrl = this.configService.get<string>('nasa.imagesApiBaseUrl');
    const url = `${imagesApiBaseUrl}${endpoint}`;
    try {
      this.logger.log(`NASA Images API Request: ${url}`);
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params,
          timeout: 10000,
        })
      );
      return response.data;
    } catch (error) {
      this.logger.error(`NASA Images API Error for ${endpoint}: ${error.message}`);
      throw new Error(`Failed to fetch data from NASA Images API: ${error.message}`);
    }
  }
} 