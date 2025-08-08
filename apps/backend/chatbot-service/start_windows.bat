@echo off
REM Windows startup script for FinVerse Chatbot Service
REM This script handles Windows-specific path and environment setup

echo Starting FinVerse Chatbot Service...

REM Set the current directory to the script's directory
cd /d "%~dp0"

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.10 or later
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo Error: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install requirements if needed
if not exist "venv\Lib\site-packages\fastapi" (
    echo Installing requirements...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo Error: Failed to install requirements
        pause
        exit /b 1
    )
)

REM Create data directory if it doesn't exist
if not exist "data" mkdir data
if not exist "data\vectordb" mkdir data\vectordb

REM Check for required environment variables
if "%DATABASE_URL%"=="" (
    echo Warning: DATABASE_URL environment variable is not set
    echo Please set your database connection string
)

if "%GOOGLE_API_KEY%"=="" (
    echo Warning: GOOGLE_API_KEY environment variable is not set
    echo Please set your Google AI API key
)

REM Set Python path to include src directory
set PYTHONPATH=%cd%\src;%PYTHONPATH%

REM Start the application
echo Starting FastAPI server...
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8085

pause
