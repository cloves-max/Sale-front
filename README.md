# Sales Front

Angular frontend that consumes the Sales API (JWT auth, products, sales).

**Repository:** [cloves-max/Sale-front](https://github.com/cloves-max/Sale-front)

## Stack

| Tech | Notes |
|------|--------|
| Angular | 19 (standalone components) |
| TypeScript | Strict mode |
| Styling | SCSS |
| Runtime (prod) | Nginx (multi-stage Docker build) |
| Dev proxy | `proxy.conf.json` → `localhost:8080` |

## Features

- Login / register (`ADMIN`, `SELLER`)
- Dashboard summary
- Products (list, create, edit, soft-delete)
- Sales (list mine, create, detail)

## Architecture

```text
src/app/
  core/        # API clients, auth, guards, interceptors, models
  shared/      # Reusable UI
  layout/      # Authenticated shell
  features/    # auth, dashboard, products, sales
```

Path aliases: `@core/*`, `@shared/*`, `@features/*`, `@layout/*`, `@env/*`

## Run with Docker (recommended)

Build and run this image alone (API must be reachable as service `app` on the same Docker network), **or** use the parent compose:

```bash
# From Projetos/ (API + MySQL + Front together)
cd ..
cp Java-api/.env .env
echo "FRONT_PORT=4200" >> .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Front | http://localhost:4200 |
| API | http://localhost:8080 |

In Docker, Nginx proxies `/api/*` to `API_UPSTREAM` (default `app:8080`). The app uses `apiBaseUrl: '/api/v1'`.

### Build this image only

```bash
cp .env.example .env   # set API_UPSTREAM=host:port of the API
docker build -t sales-front .
docker run --rm -p 4200:80 --env-file .env sales-front
```

`API_UPSTREAM` is injected at container start into the Nginx config (not baked into the image).

## Local development

Requires Node.js 20+ and the API running on `http://localhost:8080`.

```bash
npm install
npm start
```

Opens http://localhost:4200 and proxies `/api` via `proxy.conf.json`.

```bash
npm run build          # production build → dist/sales-front
```

## Environment

| File | `apiBaseUrl` |
|------|----------------|
| `environment.development.ts` | `/api/v1` (dev server proxy) |
| `environment.ts` (production) | `/api/v1` (Nginx proxy in Docker) |

## Main routes

| Route | Description |
|-------|-------------|
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/dashboard` | Summary |
| `/products` | Product CRUD |
| `/sales` | Sales list / create / detail |

## Related projects

- API (Spring Boot): [cloves-max/Java-api](https://github.com/cloves-max/Java-api)
- Local orchestration: `Projetos/docker-compose.yml`
