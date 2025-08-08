# PowerShell script for setting up FinVerse Chatbot Service with Docker

Write-Host "Starting FinVerse Chatbot Service Docker Setup..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    
    # Check if .env.example exists
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env file from .env.example. Please edit the file to add your API keys and configurations." -ForegroundColor Yellow
    } else {
        Write-Host "Error: .env.example file not found. Please create a .env file manually." -ForegroundColor Red
        exit 1
    }
}

# Check if Docker is installed
try {
    docker --version | Out-Null
} catch {
    Write-Host "Error: Docker is not installed or not in PATH. Please install Docker and try again." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "Error: Docker Compose is not installed or not in PATH. Please install Docker Compose and try again." -ForegroundColor Red
    exit 1
}

# Create necessary directories
if (-not (Test-Path "data/vectordb")) {
    New-Item -ItemType Directory -Path "data/vectordb" -Force | Out-Null
}

# Build and start containers
Write-Host "Building and starting Docker containers..." -ForegroundColor Green
docker-compose up -d --build

Write-Host "Waiting for database to initialize..." -ForegroundColor Green
Start-Sleep -Seconds 10

# Initialize database and index products
Write-Host "Initializing database and indexing products..." -ForegroundColor Green
docker-compose exec chatbot python src/scripts/init_db.py
docker-compose exec chatbot python src/scripts/index_products.py

Write-Host "FinVerse Chatbot Service is now running!" -ForegroundColor Green
Write-Host "Access the API at: http://localhost:8085" -ForegroundColor Green
Write-Host "Access the API documentation at: http://localhost:8085/docs" -ForegroundColor Green
