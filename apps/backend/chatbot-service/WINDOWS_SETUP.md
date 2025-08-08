# FinVerse Chatbot Service - Windows Setup

## Prerequisites

1. **Python 3.8+** - Download from [python.org](https://python.org)
   - Make sure to check "Add Python to PATH" during installation
2. **PostgreSQL** - Download from [postgresql.org](https://postgresql.org)
   - Default credentials: username=`postgres`, password=`postgres`
   - Create a database named `finverse`

## Quick Start

### Option 1: PowerShell (Recommended)
```powershell
# Open PowerShell as Administrator and run:
PowerShell -ExecutionPolicy Bypass -File start.ps1
```

### Option 2: Command Prompt
```cmd
# Open Command Prompt and run:
start.bat
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
