# Stage 1: build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/ui/package.json ./packages/ui/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN pnpm --filter @ig-tracker/core build
RUN pnpm --filter @ig-tracker/web build

# Stage 2: runtime
FROM node:20-alpine AS runner
RUN addgroup -g 1001 nodejs && adduser -S -u 1001 nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
