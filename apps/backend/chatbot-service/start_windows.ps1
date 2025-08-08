# PowerShell startup script for FinVerse Chatbot Service
# This script handles Windows-specific path and environment setup

Write-Host "Starting FinVerse Chatbot Service..." -ForegroundColor Green

# Set error action preference
$ErrorActionPreference = "Stop"

try {
    # Get the script directory
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $ScriptDir

    # Check if Python is available
    Write-Host "Checking Python installation..." -ForegroundColor Yellow
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Python is not installed or not in PATH. Please install Python 3.10 or later."
        exit 1
    }
    Write-Host "Found: $pythonVersion" -ForegroundColor Green

    # Check if virtual environment exists
    if (-not (Test-Path "venv\Scripts\activate.ps1")) {
        Write-Host "Creating virtual environment..." -ForegroundColor Yellow
        python -m venv venv
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create virtual environment"
            exit 1
        }
    }

    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to activate virtual environment"
        exit 1
    }

    # Install requirements if needed
    if (-not (Test-Path "venv\Lib\site-packages\fastapi")) {
        Write-Host "Installing requirements..." -ForegroundColor Yellow
        pip install -r requirements.txt
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install requirements"
            exit 1
        }
    }

    # Create data directories if they don't exist
    Write-Host "Creating data directories..." -ForegroundColor Yellow
    if (-not (Test-Path "data")) { New-Item -ItemType Directory -Path "data" -Force | Out-Null }
    if (-not (Test-Path "data\vectordb")) { New-Item -ItemType Directory -Path "data\vectordb" -Force | Out-Null }

    # Check for required environment variables
    Write-Host "Checking environment variables..." -ForegroundColor Yellow
    if (-not $env:DATABASE_URL) {
        Write-Warning "DATABASE_URL environment variable is not set"
        Write-Host "Please set your database connection string" -ForegroundColor Yellow
    } else {
        Write-Host "DATABASE_URL is configured" -ForegroundColor Green
    }

    if (-not $env:GOOGLE_API_KEY) {
        Write-Warning "GOOGLE_API_KEY environment variable is not set"  
        Write-Host "Please set your Google AI API key" -ForegroundColor Yellow
    } else {
        Write-Host "GOOGLE_API_KEY is configured" -ForegroundColor Green
    }

    # Set Python path to include src directory
    $env:PYTHONPATH = "$ScriptDir\src;$env:PYTHONPATH"
    Write-Host "Set PYTHONPATH to include src directory" -ForegroundColor Green

    # Start the application
    Write-Host "Starting FastAPI server..." -ForegroundColor Green
    Write-Host "Server will be available at: http://localhost:8085" -ForegroundColor Cyan
    Write-Host "API Documentation: http://localhost:8085/docs" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    
    python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8085

} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    Read-Host "Press Enter to exit"
    exit 1
}
