# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install only essential build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first (better layer caching)
COPY package*.json ./

# Install all dependencies (including devDependencies) for build
RUN npm ci --no-audit --no-optional

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Prune devDependencies after build
RUN npm prune --omit=dev && npm cache clean --force

# Production stage - use distroless for minimal size
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/docs/openapi-v1.yaml ./

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "dist/server.js"]