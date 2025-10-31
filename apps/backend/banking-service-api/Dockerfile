# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install python and build dependencies required for node-gyp
RUN apk add --no-cache python3 make g++ 

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including 'prisma' for the build
RUN npm ci --no-audit --no-optional && \
    npx prisma generate

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build && \
    npm prune --production

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache libc6-compat

# Copy package files and built assets from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Clean npm cache
RUN npm cache clean --force && \
    rm -rf /root/.npm /root/.node-gyp

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]