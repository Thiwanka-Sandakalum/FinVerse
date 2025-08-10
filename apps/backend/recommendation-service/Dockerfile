# Use multi-stage build for smaller final image
FROM python:3.9-slim-bullseye AS builder

# Set work directory for build
WORKDIR /build

# Copy requirements file
COPY requirements.txt .

# Install build dependencies and create wheel packages
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# Start final stage
FROM python:3.9-slim-bullseye

# Set Python to run in unbuffered mode
ENV PYTHONUNBUFFERED=1
# Prevent Python from writing pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Set timezone
ENV TZ=UTC

# Set working directory
WORKDIR /app

# Create non-root user with specific UID as required by Choreo (must be between 10000-20000)
RUN groupadd -r finverse -g 10001 && \
    useradd -r -g finverse -u 10001 -s /bin/false -d /app finverse

# Install only required runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libomp-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory and create necessary directories
WORKDIR /app
RUN mkdir -p /app/data /app/logs && \
    chown -R finverse:finverse /app

# Copy wheels from builder stage
COPY --from=builder /build/wheels /wheels

# Install Python packages from wheels
RUN pip install --no-cache-dir /wheels/*

# Copy application code
COPY --chown=finverse:finverse src/ /app/src/
COPY --chown=finverse:finverse data/ /app/data/

# Create directories with proper permissions
RUN mkdir -p /app/data /app/logs && \
    chown -R finverse:finverse /app/data /app/logs && \
    chmod 755 /app/logs

# Set environment variables
ENV PYTHONPATH=/app
ENV API_HOST=0.0.0.0
ENV API_PORT=4003
ENV MONGO_URI=mongodb://mongo:27017
ENV MONGO_DB=finverse_interactions
ENV BANKING_SERVICE_URL=http://banking-service:4001/api/v1

# Expose port
EXPOSE 4003

# Switch to non-root user
USER finverse

# Add healthcheck for the API endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${API_PORT}/api/v1/health || exit 1

# Switch to non-root user as required by Choreo
USER 10001

# Set the default command with explicit Python path
CMD ["/usr/local/bin/python", "src/main.py"]
