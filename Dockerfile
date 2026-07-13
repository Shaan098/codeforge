# ============================================================
# CodeForge Enterprise — Multi-stage Dockerfile
# ============================================================
# Stage 1: Build React frontend
# Stage 2: Production image (serves built frontend + API)
# ============================================================

# ── Stage 1: Frontend Build ───────────────────────────────────────────────────
FROM node:22-alpine AS frontend-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci --prefer-offline

COPY client/ ./
RUN npm run build

# ── Stage 2: Production Runtime ───────────────────────────────────────────────
FROM node:22-alpine AS production

# System deps for code sandbox execution
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Install only production runtime deps
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline

# Copy the Express server. It runs directly as native ES modules.
COPY server/ ./server/

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

CMD ["node", "server/index.js"]
