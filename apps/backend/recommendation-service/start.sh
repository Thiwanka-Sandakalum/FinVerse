#!/bin/bash

# Start script for the recommendation service

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Please run ./setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if we should increase file watch limit
if [ "$1" = "--with-reload" ]; then
    echo "Starting with file watching enabled..."
    echo "If you get file watch limit errors, run:"
    echo "echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p"
    echo ""
    uvicorn src.main:app --host 0.0.0.0 --port 4003 --reload
else
    echo "Starting recommendation service (no file watching)..."
    uvicorn src.main:app --host 0.0.0.0 --port 4003
fi
