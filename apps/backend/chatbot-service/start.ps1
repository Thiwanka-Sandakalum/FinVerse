# PowerShell setup and start script for FinVerse Chatbot Service
# Run this with: PowerShell -ExecutionPolicy Bypass -File start.ps1

Write-Host "Starting FinVerse Chatbot Service Setup..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>$null
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
    exit 1
}

# Check if virtual environment exists, create if not
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to activate virtual environment" -ForegroundColor Red
    exit 1
}

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install requirements" -ForegroundColor Red
    exit 1
}

# Set environment variables from .env file
Write-Host "Loading environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
} else {
    Write-Host "Warning: .env file not found" -ForegroundColor Yellow
}

# Set PYTHONPATH
$env:PYTHONPATH = "$PWD;$env:PYTHONPATH"

# Initialize database and index products
Write-Host "Initializing database..." -ForegroundColor Yellow
python src/scripts/init_db.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Database initialization failed or already completed" -ForegroundColor Yellow
}

Write-Host "Indexing products in vector store..." -ForegroundColor Yellow
python src/scripts/index_products.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Product indexing failed" -ForegroundColor Yellow
}

# Start the application
Write-Host "Starting FastAPI application..." -ForegroundColor Green
Write-Host "Server will be available at http://localhost:8085" -ForegroundColor Cyan
uvicorn src.main:app --host 0.0.0.0 --port 8085 --reload
