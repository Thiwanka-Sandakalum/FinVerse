# Use Node.js official image with Alpine for smaller size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for native modules (needed for Prisma)
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for TypeScript compilation)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript application
RUN npm run build

# Clean up dev dependencies and reinstall only production dependencies
RUN rm -rf node_modules && npm ci --only=production && npm cache clean --force

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S banking-service -u 1001

# Copy built application and necessary files from builder stage
COPY --from=builder --chown=banking-service:nodejs /app/dist ./dist
COPY --from=builder --chown=banking-service:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=banking-service:nodejs /app/package.json ./
COPY --from=builder --chown=banking-service:nodejs /app/prisma ./prisma

# Ensure Prisma client is properly generated in production
RUN npx prisma generate

# Switch to non-root user
USER banking-service

# Expose the port the app runs on
EXPOSE 4001

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
