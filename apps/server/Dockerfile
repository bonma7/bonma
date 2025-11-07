# Use official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies (production + dev for build)
FROM base AS install
COPY package.json bun.lockb ./
COPY packages/db/package.json ./packages/db/
COPY packages/api/package.json ./packages/api/
COPY packages/config/package.json ./packages/config/
COPY apps/server/package.json ./apps/server/
RUN bun install --frozen-lockfile

# Copy source files and build
FROM install AS build
COPY . .
# Generate Prisma client
RUN cd packages/db && bun run generate
# Build server
RUN cd apps/server && bun run build

# Production image
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/packages ./packages
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/package.json ./apps/server/
COPY --from=build /app/package.json ./

# Expose port
EXPOSE 10000

# Run migrations and start server
WORKDIR /app/apps/server
CMD ["sh", "-c", "cd ../../packages/db && bun run push && cd ../../apps/server && bun run start"]
