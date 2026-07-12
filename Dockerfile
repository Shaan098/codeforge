# ============================================================
# CodeForge Enterprise — Multi-stage Dockerfile
# ============================================================
# Stage 1: Build React frontend
# Stage 2: Build Express server (TypeScript → CJS)
# Stage 3: Production image (serves built frontend + API)
# ============================================================

# ── Stage 1: Frontend Build ───────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci --prefer-offline

COPY client/ ./
RUN npm run build

# ── Stage 2: Server Build ─────────────────────────────────────────────────────
FROM node:22-alpine AS server-builder

WORKDIR /app

# Install root deps (includes esbuild, tsx, typescript)
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy server source
COPY server/ ./server/

# Bundle server/index.ts → dist/server.cjs
RUN npx esbuild server/index.ts \
      --bundle \
      --platform=node \
      --format=cjs \
      --packages=external \
      --sourcemap \
      --outfile=dist/server.cjs

# ── Stage 3: Production Runtime ───────────────────────────────────────────────
FROM node:22-alpine AS production

# System deps for code sandbox execution
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Install only production runtime deps
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline

# Copy compiled server bundle
COPY --from=server-builder /app/dist ./dist

# Copy built frontend
COPY --from=frontend-builder /app/client/build ./client/build

# Copy env example
COPY .env.example ./.env.example

# Sandbox temp dir for code execution
RUN mkdir -p ./server/tmp_sandbox && chmod 777 ./server/tmp_sandbox

# Non-root user for security
RUN addgroup -g 1001 -S codeforge && \
    adduser -S codeforge -u 1001
USER codeforge

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

ENV NODE_ENV=production

CMD ["node", "dist/server.cjs"]
