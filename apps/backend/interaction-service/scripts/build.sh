#!/bin/bash

# Build script for interaction service

# Navigate to the service directory
cd "$(dirname "$0")"

echo "Building Interaction Service..."

# Check if Go is installed
if ! command -v go &> /dev/null; then
  echo "Error: Go is not installed or not in PATH"
  exit 1
fi

# Download dependencies
echo "Downloading dependencies..."
go mod download

# Build the service
echo "Compiling service..."
go build -o bin/interaction-service ./cmd

if [ $? -eq 0 ]; then
  echo "Build successful! Binary is at bin/interaction-service"
else
  echo "Build failed!"
  exit 1
fi

# Create config directory if it doesn't exist
mkdir -p bin/config

# Copy config file
echo "Copying configuration files..."
cp config/config.yaml bin/config/

echo "Build process complete!"
