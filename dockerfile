# --- STAGE 1: Base & Dependencies ---
FROM node:20-alpine AS base
# Install pnpm globally via npm to avoid Corepack network crashes
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# --- STAGE 2: Builder ---
FROM base AS builder
COPY prisma ./prisma/

# Install dependencies non-interactively
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma Client & Build Next.js
RUN pnpm exec prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm build

# --- STAGE 3: Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]