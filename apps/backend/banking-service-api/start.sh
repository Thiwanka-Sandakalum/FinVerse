#!/bin/bash

# Start script for the banking service

echo "Starting Banking Service..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing..."
    npm install
fi

# Check if we should run with file watching
if [ "$1" = "--with-reload" ]; then
    echo "Starting with file watching enabled (development mode)..."
    npm run dev
else
    echo "Starting without file watching..."
    npm run build && npm start
fi
