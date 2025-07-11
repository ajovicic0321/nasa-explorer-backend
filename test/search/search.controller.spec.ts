import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '../../src/search/search.controller';
import { SearchService, NasaImageSearchResponse, NewsItem } from '../../src/search/search.service';

describe('SearchController', () => {
  let controller: SearchController;
  let service: jest.Mocked<SearchService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {
            search: jest.fn(),
            getNews: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    service = module.get(SearchService);
  });

  it('should return search results from the service', async () => {
    const searchResult: NasaImageSearchResponse = { collection: { version: '1.1', href: '', items: [] } };
    service.search.mockResolvedValueOnce(searchResult);
    const result = await controller.search('test', 1);
    expect(result).toEqual(searchResult);
    expect(service.search).toHaveBeenCalledWith('test', 1);
  });

  it('should return news from the service', async () => {
    const news: NewsItem[] = [];
    service.getNews.mockResolvedValueOnce(news);
    const result = await controller.getNews();
    expect(result).toEqual(news);
    expect(service.getNews).toHaveBeenCalled();
  });
}); 