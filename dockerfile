FROM node:20-alpine

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy lockfile and package manifest
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma Client & Build Next.js
RUN pnpm exec prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]

# docker compose up postgres -d
# docker compose up --build