# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -r finverse && \
    useradd -r -g finverse -s /bin/false -d /app finverse && \
    chown -R finverse:finverse /app

# Copy requirements file
COPY --chown=finverse:finverse requirements.txt .

# Install system dependencies required for building lightfm
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libomp-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

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

# Set the default command
CMD ["python", "src/main.py"]
