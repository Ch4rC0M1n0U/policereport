# Use a Debian-based Node.js image for better compatibility
FROM node:18-bullseye-slim AS base
WORKDIR /app

# Install system dependencies needed for native module compilation
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Using npm ci is generally recommended for reproducible builds if package-lock.json is committed and up-to-date
# RUN npm ci
# Or, stick with npm install if you prefer. Add --verbose for more detailed logs if it fails.
RUN npm install

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production runner stage
FROM node:18-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Create a non-root user and group
# The node:18-bullseye-slim image already has a 'node' user (UID 1000, GID 1000)
# We will use that existing 'node' user.
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# Copy built artifacts
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Switch to the non-root user 'node'
USER node

EXPOSE 3000

CMD ["node", "server.js"]
