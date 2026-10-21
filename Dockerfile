# Poulstar | One container for NestJS API and the built React app.
# Select Dockerfile as the build method in DockHosting when available.
FROM node:22-alpine
WORKDIR /app

# TypeScript and Vite require devDependencies while building.
COPY package*.json ./
RUN npm install --include=dev --no-audit --no-fund

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Crucial: start NestJS instead of auto-generated Caddy/static serving.
CMD ["npm", "start"]
