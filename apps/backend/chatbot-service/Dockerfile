# Multi-stage Docker build for FinVerse Chatbot Service
# Stage 1: Base image with system dependencies
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    python3-dev \
    libffi-dev \
    libssl-dev \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app directory and user
RUN useradd --create-home --shell /bin/bash app
WORKDIR /app

# Stage 2: Dependencies installation
FROM base as dependencies

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Stage 3: Application
FROM dependencies as application

# Create necessary directories
RUN mkdir -p /app/data/vectordb /app/logs /app/static /app/src

# Copy application files
COPY src/ ./src/
COPY static/ ./static/
COPY .env.example ./.env.example

# Copy startup script and make it executable
COPY start.sh ./
RUN chmod +x start.sh

# Set proper permissions
RUN chown -R app:app /app
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8085/ || exit 1

# Expose port
EXPOSE 8085

# Default command
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8085", "--workers", "1"]