# Use official Python image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install system dependencies required for building lightfm
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libomp-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY src/ /app/src/
COPY data/ /app/data/

# Create directories
RUN mkdir -p /app/data /app/logs && \
    chmod 777 /app/logs

# Set environment variables
ENV PYTHONPATH=/app
ENV API_HOST=0.0.0.0
ENV API_PORT=4003
ENV MONGO_URI=mongodb://mongo:27017
ENV MONGO_DB=finverse_interactions
ENV BANKING_SERVICE_URL=http://banking-service:4001/api/v1

# Expose port
EXPOSE 4003

# Set the default command
CMD ["python", "src/main.py"]
