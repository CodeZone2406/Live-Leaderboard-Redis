FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./


RUN npm ci


COPY src/ ./src


RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production


RUN npm ci --only=production

COPY --from=builder /app/dist ./dist


EXPOSE 8080

CMD ["node", "dist/index.js"]