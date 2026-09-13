# Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production

# Serve with Nginx (envsubst renders templates from /etc/nginx/templates)
FROM nginx:1.27-alpine

COPY Docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/sales-front/browser /usr/share/nginx/html

# host:port of the Sales API (overridden at runtime via env)
ENV API_UPSTREAM=app:8080

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
