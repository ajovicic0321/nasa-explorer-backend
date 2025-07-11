import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mockRequest = { url: '/test' };
    mockHost = {
      switchToHttp: () => ({ getResponse: () => mockResponse, getRequest: () => mockRequest }),
    } as any;
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it('should handle HttpException and format response', () => {
    const exception = new HttpException('fail', HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: HttpStatus.BAD_REQUEST,
      path: '/test',
      message: 'fail',
    }));
  });

  it('should handle generic error', () => {
    const exception = new Error('fail2');
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: '/test',
      message: 'fail2',
    }));
  });
}); 