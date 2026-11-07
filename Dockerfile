FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN npm install -g pnpm

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "exec", "vinext", "start", "-p", "3000", "-H", "0.0.0.0"]
