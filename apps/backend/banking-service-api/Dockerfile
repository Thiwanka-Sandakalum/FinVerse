# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install only essential build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first (better layer caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --no-audit --no-optional --omit=dev && \
    npx prisma generate && \
    npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage - use distroless for minimal size
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/banking-service-api.yaml ./

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