# FinVerse Chatbot Service - Windows Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+** - Download from [python.org](https://python.org) 
  - ✅ Make sure to check "Add Python to PATH" during installation
- **PostgreSQL** - Download from [postgresql.org](https://postgresql.org)
  - Default setup: Create database named `finverse`
- **Google AI API Key** - Get from [Google AI Studio](https://aistudio.google.com/)

### Automated Setup (Recommended)

**Option 1: PowerShell Script**
```powershell
# Set your environment variables
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/finverse"
$env:GOOGLE_API_KEY = "your-google-api-key-here"

# Run the automated setup script
.\start_windows.ps1
```

**Option 2: Command Prompt Script**  
```cmd
REM Set your environment variables
set DATABASE_URL=postgresql://user:password@localhost:5432/finverse
set GOOGLE_API_KEY=your-google-api-key-here

REM Run the automated setup script
start_windows.bat
```

## ✨ Windows-Specific Improvements

This version includes major improvements for Windows compatibility:

### 🛠️ Cross-Platform Path Management
- **New path utility system** handles Windows vs. Unix path differences automatically
- **No more path separator issues** - all paths work on both Windows and Linux
- **Automatic directory creation** using Windows-compatible methods

### 📦 Enhanced Startup Scripts
- **`start_windows.ps1`** - PowerShell script with error handling and status messages
- **`start_windows.bat`** - Command Prompt batch script for simpler environments  
- **Automatic virtual environment setup** and dependency installation
- **Environment validation** to catch common configuration issues

## 📁 File Structure

The application now uses this cross-platform directory structure:
```
FinVerse\apps\backend\chatbot-service\
├── data\                          # Auto-created data storage
│   ├── chat_history.sqlite        # Chat history database  
│   └── vectordb\                  # Vector database files
├── src\utils\paths.py             # 🆕 Cross-platform path management
├── start_windows.bat              # 🆕 Windows Command Prompt script
├── start_windows.ps1              # 🆕 Windows PowerShell script  
└── WINDOWS_SETUP_DETAILED.md      # 🆕 Comprehensive setup guide
```

## Manual Setup

If the automated scripts don't work, follow these steps:

1. **Create and activate virtual environment:**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```cmd
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Set environment variables:**
   - Make sure your `.env` file exists with proper configuration
   - Key variables: `DATABASE_URL`, `GOOGLE_API_KEY`, `PORT`

4. **Initialize the application:**
   ```cmd
   set PYTHONPATH=%CD%;%PYTHONPATH%
   python src/scripts/init_db.py
   python src/scripts/index_products.py
   ```

5. **Start the server:**
   ```cmd
   uvicorn src.main:app --host 0.0.0.0 --port 8085 --reload
   ```

## Configuration

Update the `.env` file with your specific settings:

```properties
PORT=8085
ENVIRONMENT=development
LOG_LEVEL=INFO
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finverse
GOOGLE_API_KEY=your_google_api_key_here
```

## Access

- **API Server:** http://localhost:8085
- **API Documentation:** http://localhost:8085/docs
- **Web Interface:** http://localhost:8085 (static files)

## Troubleshooting

### Common Issues:

1. **Python not found:**
   - Ensure Python is installed and added to PATH
   - Restart your terminal after Python installation

2. **Virtual environment activation fails:**
   - On PowerShell, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

3. **Database connection error:**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database `finverse` exists

4. **Module import errors:**
   - Ensure PYTHONPATH includes the project root
   - Check if all requirements are installed: `pip list`

5. **Port already in use:**
   - Change PORT in .env file
   - Or kill process using port 8085: `netstat -ano | findstr :8085`

## Development

For development work:
- Use `start.ps1` or `start.bat` for quick startup
- The server runs with `--reload` flag for auto-restart on changes
- Logs are available in the console output

## Directory Structure

```
chatbot-service/
├── src/              # Source code
├── data/             # SQLite databases and vector store
├── static/           # Web interface files
├── requirements.txt  # Python dependencies
├── .env             # Environment variables
├── start.ps1        # PowerShell startup script
├── start.bat        # Batch startup script
└── start.sh         # Linux startup script (original)
```
