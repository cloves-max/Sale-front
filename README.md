# Sales Front

Angular 19 frontend for the Spring Boot Sales API. Designed to run in Docker with Nginx.

## Docker (recommended)

From the monorepo root (`Projetos/`):

```bash
cp Java-api/.env .env
# optional: echo "FRONT_PORT=4200" >> .env

docker compose up --build
```

| Service | URL |
|---------|-----|
| Front (Nginx) | http://localhost:4200 |
| API (direct) | http://localhost:8080 |
| MySQL | localhost:3306 |

The front container proxies `/api/*` to the `app` service, so the browser always calls same-origin `/api/v1`.

## Local development (optional)

```bash
npm install
npm start
```

Uses `proxy.conf.json` → `http://localhost:8080` while the API runs (Docker or local).

## Architecture

```text
src/app/
  core/        # API clients, auth, guards, interceptors, models
  shared/      # Reusable UI
  layout/      # Authenticated shell
  features/    # auth, dashboard, products, sales
```

Production image: multi-stage Node build + Nginx (`Dockerfile`).
