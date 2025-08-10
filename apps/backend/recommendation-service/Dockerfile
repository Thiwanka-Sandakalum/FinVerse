# Use multi-stage build for smaller final image
FROM python:3.10-alpine AS builder

# Set work directory for build
WORKDIR /build

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    python3-dev \
    openmp-dev \
    openblas-dev \
    linux-headers \
    make \
    curl-dev

# Copy requirements file
COPY requirements.txt .

# Install build dependencies and create wheel packages
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# Start final stage
FROM python:3.10-alpine

# Set Python to run in unbuffered mode
ENV PYTHONUNBUFFERED=1
# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Set timezone
ENV TZ=UTC

# Install runtime dependencies
RUN apk add --no-cache \
    libgomp \
    curl \
    tzdata

# Create non-root user with specific UID as required by Choreo (must be between 10000-20000)
RUN addgroup -g 10001 -S finverse && \
    adduser -u 10001 -S finverse -G finverse -h /app -s /sbin/nologin

# Set working directory and create necessary directories
WORKDIR /app
RUN mkdir -p /app/data /app/logs && \
    chown -R finverse:finverse /app

# Copy application code
COPY --chown=finverse:finverse src/ /app/src/
COPY --chown=finverse:finverse data/ /app/data/

# Copy wheels from builder stage
COPY --from=builder /build/wheels /wheels

# Install Python packages from wheels
RUN pip install --no-cache-dir /wheels/* && \
    rm -rf /wheels && \
    rm -rf /root/.cache/pip/*

# Set environment variables
ENV PYTHONPATH=/app
ENV API_HOST=0.0.0.0
ENV API_PORT=4003
ENV MONGO_URI=mongodb://mongo:27017
ENV MONGO_DB=finverse_interactions
ENV BANKING_SERVICE_URL=http://banking-service:4001/api/v1

# Expose port
EXPOSE 4003

# Add healthcheck for the API endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${API_PORT}/api/v1/health || exit 1

# Switch to non-root user as required by Choreo
USER 10001

# Set the default command with explicit Python path
CMD ["/usr/local/bin/python", "src/main.py"]
