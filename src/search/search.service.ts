import { Injectable } from '@nestjs/common';
import { NasaService } from '../nasa/nasa.service';
import { CacheService } from '../cache/cache.service';

export interface NasaImageSearchLink {
  href: string;
  rel: string;
  render: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface NasaImageSearchData {
  album?: string[];
  center: string;
  date_created: string;
  description: string;
  keywords?: string[];
  location?: string;
  media_type: string;
  nasa_id: string;
  photographer?: string;
  title: string;
}

export interface NasaImageSearchItem {
  href: string;
  data: NasaImageSearchData[];
  links?: NasaImageSearchLink[];
}

export interface NasaImageSearchCollection {
  version: string;
  href: string;
  items: NasaImageSearchItem[];
  metadata?: {
    total_hits: number;
  };
}

export interface NasaImageSearchResponse {
  collection: NasaImageSearchCollection;
}

export interface NewsItem {
  title: string;
  description: string;
  date: string;
  category: string;
  nasa_id: string;
  center: string;
  keywords: string[];
  media_type: string;
}

@Injectable()
export class SearchService {
  private readonly newsSearches = [
    'Webb telescope discovery',
    'Mars rover findings',
    'NASA mission updates',
    'space exploration news',
    'asteroid detection',
  ];

  constructor(
    private readonly nasaService: NasaService,
    private readonly cacheService: CacheService,
  ) { }

  async search(q: string, page = 1): Promise<NasaImageSearchResponse> {
    const cacheKey = `search:q:${q}:page:${page}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const data = await this.nasaService.makeNASAImagesRequest('/search', { q, page });
    const ttl = 3600;
    await this.cacheService.set(cacheKey, JSON.stringify(data), ttl);
    return data;
  }

  async getNews(): Promise<NewsItem[]> {
    const cacheKey = 'search:news:latest';
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const newsItems: NewsItem[] = [];
    for (const searchTerm of this.newsSearches.slice(0, 3)) {
      try {
        const searchResults = await this.nasaService.makeNASAImagesRequest('/search', { q: searchTerm, page: 1 });
        if (searchResults.collection && searchResults.collection.items) {
          const recentItem = searchResults.collection.items[0];
          if (recentItem && recentItem.data && recentItem.data.length > 0) {
            const itemData = recentItem.data[0];
            newsItems.push({
              title: itemData.title,
              description: itemData.description,
              date: itemData.date_created,
              category: searchTerm.split(' ')[0].toUpperCase(),
              nasa_id: itemData.nasa_id,
              center: itemData.center,
              keywords: itemData.keywords || [],
              media_type: itemData.media_type,
            });
          }
        }
      } catch (searchError) {
        console.log(`Error in searching for: ${searchTerm}`);
        console.log(searchError);
      }
    }
    newsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    await this.cacheService.set(cacheKey, JSON.stringify(newsItems.slice(0, 3)), 3600);
    return newsItems.slice(0, 3);
  }
} 