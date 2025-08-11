#!/bin/bash

# Azure Web App startup script for banking-service-api

echo "Starting banking service API..."

# Set NODE_ENV to production if not set
export NODE_ENV=${NODE_ENV:-production}

# Generate Prisma client if needed
echo "Generating Prisma client..."
npx prisma generate

# Check if database is accessible (optional, comment out if not needed)
# echo "Checking database connection..."
# npx prisma db seed --preview-feature || echo "Database seed failed or not configured"

# Start the application
echo "Starting Node.js application..."
node dist/index.js
