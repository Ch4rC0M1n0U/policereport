# Use the official Node.js 18 image as base
FROM node:18-alpine AS base
WORKDIR /app

# Installer les dépendances système nécessaires pour la compilation de certains paquets npm (comme pg potentiellement)
# python3, make, g++ sont souvent requis par node-gyp
# libc6-compat est pour la compatibilité avec glibc sur Alpine
RUN apk add --no-cache libc6-compat python3 make g++

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app
COPY package.json package-lock.json* ./
# Installer TOUTES les dépendances (y compris devDependencies si des scripts de build en ont besoin)
# Si pg a besoin de compiler, les outils de build de l'étape 'base' seront utilisés.
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# Le port sera défini par docker-compose ou EasyPanel, mais on peut le mettre par défaut
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Créer un utilisateur et un groupe non-root pour l'application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les artefacts de build de l'étape 'builder'
# Utiliser la sortie "standalone" de Next.js pour une image plus petite
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

# Définir l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Commande pour démarrer l'application
# server.js est créé par `next build` avec `output: 'standalone'`
CMD ["node", "server.js"]
