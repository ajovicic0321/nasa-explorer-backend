import { LoggerMiddleware } from '../../../src/common/middleware/logger.middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    req = { method: 'GET', originalUrl: '/test' };
    res = { on: jest.fn((event, cb) => cb()), statusCode: 200 };
    next = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
  });

  it('should log the request and call next', () => {
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GET /test 200'));
  });
}); 