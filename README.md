
# NASA NestJS Backend

A modular, production-ready NestJS backend for exploring NASA APIs, including APOD, Mars Rover, EPIC, NEO, NASA Image Search, and more.  
Includes robust caching, rate limiting, error handling, and environment-based configuration.

---

## Features

- **Modular Structure:** Each NASA API feature (APOD, Mars, EPIC, NEO, Search, Stats) is a separate module.
- **Centralized NASA API Logic:** All NASA API calls are handled via a shared service.
- **Redis Caching:** Fast, configurable caching for all endpoints.
- **Rate Limiting:** Protects your API from abuse.
- **Global Error Handling:** Consistent, JSON-formatted error responses.
- **CORS:** Configurable via environment variables.
- **Environment-based Configuration:** All keys, URLs, and settings are managed via `.env`.

---

## Directory Structure

```
src/
│
├── app.module.ts
├── main.ts
│
├── config/
│   ├── nasa.config.ts
│   └── cache.config.ts
│
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   └── middleware/
│       ├── logger.middleware.ts
│       └── rate-limit.middleware.ts
│
├── cache/
│   ├── cache.module.ts
│   └── cache.service.ts
│
├── nasa/
│   ├── nasa.module.ts
│   └── nasa.service.ts
│
├── apod/
│   ├── apod.module.ts
│   ├── apod.service.ts
│   └── apod.controller.ts
│
├── mars/
│   ├── mars.module.ts
│   ├── mars.service.ts
│   └── mars.controller.ts
│
├── epic/
│   ├── epic.module.ts
│   ├── epic.service.ts
│   └── epic.controller.ts
│
├── neo/
│   ├── neo.module.ts
│   ├── neo.service.ts
│   └── neo.controller.ts
│
├── search/
│   ├── search.module.ts
│   ├── search.service.ts
│   └── search.controller.ts
│
├── stats/
│   ├── stats.module.ts
│   ├── stats.service.ts
│   └── stats.controller.ts
│
└── public/
    └── (static assets, if needed)
```


## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=admin
REDIS_DB=1
NASA_API_BASE_URL=https://api.nasa.gov
NASA_IMAGES_API_BASE_URL=https://images-api.nasa.gov
NASA_API_KEY=DEMO_KEY
PORT=3003
ORIGIN=http://localhost:3000,http://localhost:4200
```

- `PORT`: The port the server will run on.
- `ORIGIN`: Comma-separated list of allowed CORS origins.
- `NASA_API_KEY`: Get your own key from https://api.nasa.gov.
- `REDIS_*`: Redis connection info for caching.

---

## Setup & Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and edit as needed.

```bash
cp .env.example .env
```

### 3. Start Redis

Make sure you have a Redis server running and accessible with the credentials in your `.env`.

### 4. Run the server

```bash
# Development (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server will start on the port specified in your `.env` (default: 3003).

---

## API Endpoints

All endpoints are prefixed with `/api` (e.g., `/api/apod`).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check endpoint |
| `/api/apod` | GET | Astronomy Picture of the Day |
| `/api/mars-photos` | GET | Mars rover photos |
| `/api/mars-rovers` | GET | Mars rovers information |
| `/api/neo` | GET | Near Earth Objects |
| `/api/search` | GET | NASA media library search |
| `/api/epic` | GET | Earth Polychromatic Imaging Camera |

Each endpoint supports query parameters as per the NASA API documentation.

---

## Caching

- All endpoints use Redis for caching.
- Cache durations are tuned per endpoint (e.g., APOD by date is cached for 30 days).
- Configure Redis via `.env`.

---

## Middleware & Error Handling

- **Logger:** Logs all requests with method, URL, status, and response time.
- **Rate Limiting:** 100 requests per 15 minutes per IP for `/api/` routes.
- **Global Exception Filter:** All errors are returned as JSON with status, message, and timestamp.

---

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Linting & Formatting

```bash
npm run lint
npm run format
```

---

## Deployment

- Use `npm run build` and `npm run start:prod` for production.
- Set all environment variables in your production environment.
- Make sure Redis is available in production.

---

## Contributing

PRs and issues are welcome! Please follow the NestJS style and best practices.

---

## License

MIT

---

## Credits

- Built with [NestJS](https://nestjs.com/)
- NASA Open APIs
