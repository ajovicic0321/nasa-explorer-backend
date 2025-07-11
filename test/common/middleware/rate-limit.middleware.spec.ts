import { RateLimitMiddleware } from '../../../src/common/middleware/rate-limit.middleware';

jest.mock('express-rate-limit', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn((req, res, next) => next())),
}));

describe('RateLimitMiddleware', () => {
  let middleware: RateLimitMiddleware;
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new RateLimitMiddleware();
    res = {};
    next = jest.fn();
  });

  it('should apply limiter for /api/ routes', () => {
    req = { originalUrl: '/api/test' };
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should call next for non-/api/ routes', () => {
    req = { originalUrl: '/other' };
    middleware.use(req, res, next);
    expect(next).toHaveBeenCalled();
  });
}); 