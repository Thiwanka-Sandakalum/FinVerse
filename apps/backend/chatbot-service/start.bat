@echo off
REM Batch setup and start script for FinVerse Chatbot Service

echo Starting FinVerse Chatbot Service Setup...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Python found: 
python --version

REM Check if virtual environment exists, create if not
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Failed to activate virtual environment
    pause
    exit /b 1
)

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install requirements
    pause
    exit /b 1
)

REM Set PYTHONPATH
set PYTHONPATH=%CD%;%PYTHONPATH%

REM Load environment variables from .env file
if exist .env (
    echo Loading environment variables...
    for /f "usebackq delims=" %%i in (".env") do (
        set %%i
    )
) else (
    echo Warning: .env file not found
)

REM Initialize database and index products
echo Initializing database...
python src/scripts/init_db.py

echo Indexing products in vector store...
python src/scripts/index_products.py

REM Start the application
echo Starting FastAPI application...
echo Server will be available at http://localhost:8085
uvicorn src.main:app --host 0.0.0.0 --port 8085 --reload

pause
