import { Controller, Get, Query } from '@nestjs/common';
import { SearchService, NasaImageSearchResponse, NewsItem } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  async search(
    @Query('q') q: string,
    @Query('page') page?: number,
  ): Promise<NasaImageSearchResponse> {
    if (!q) {
      throw new Error('Search query is required');
    }
    return this.searchService.search(q, page ? Number(page) : 1);
  }

  @Get('news')
  async getNews(): Promise<NewsItem[]> {
    return this.searchService.getNews();
  }
} 