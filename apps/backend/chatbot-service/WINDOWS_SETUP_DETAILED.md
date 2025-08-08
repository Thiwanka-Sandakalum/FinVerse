# Windows Setup Guide for FinVerse Chatbot Service

This guide provides detailed instructions for setting up and running the FinVerse Chatbot Service on Windows systems.

## Prerequisites

### 1. Python Installation
- Install Python 3.10 or later from [python.org](https://www.python.org/downloads/)
- During installation, make sure to check "Add Python to PATH"
- Verify installation by opening Command Prompt and running:
  ```cmd
  python --version
  ```

### 2. Git (Optional but recommended)
- Install Git from [git-scm.com](https://git-scm.com/download/win)
- This allows you to clone the repository and manage updates

### 3. Database Setup
- Ensure you have access to a PostgreSQL database
- Note down your database connection details

### 4. API Keys
- Obtain a Google AI API key from [Google AI Studio](https://aistudio.google.com/)

## Setup Instructions

### Option 1: Using PowerShell (Recommended)

1. **Open PowerShell as Administrator**
   - Press `Win + X` and select "Windows PowerShell (Admin)"

2. **Enable Script Execution** (if needed)
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Navigate to the Project Directory**
   ```powershell
   cd "C:\path\to\your\project\FinVerse\apps\backend\chatbot-service"
   ```

4. **Set Environment Variables**
   ```powershell
   $env:DATABASE_URL = "postgresql://user:password@localhost:5432/finverse"
   $env:GOOGLE_API_KEY = "your-google-api-key-here"
   ```

5. **Run the PowerShell Setup Script**
   ```powershell
   .\start_windows.ps1
   ```

### Option 2: Using Command Prompt

1. **Open Command Prompt as Administrator**
   - Press `Win + R`, type `cmd`, press `Ctrl + Shift + Enter`

2. **Navigate to the Project Directory**
   ```cmd
   cd "C:\path\to\your\project\FinVerse\apps\backend\chatbot-service"
   ```

3. **Set Environment Variables**
   ```cmd
   set DATABASE_URL=postgresql://user:password@localhost:5432/finverse
   set GOOGLE_API_KEY=your-google-api-key-here
   ```

4. **Run the Batch Setup Script**
   ```cmd
   start_windows.bat
   ```

### Option 3: Manual Setup

1. **Create Virtual Environment**
   ```cmd
   python -m venv venv
   ```

2. **Activate Virtual Environment**
   ```cmd
   venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Create Data Directories**
   ```cmd
   mkdir data
   mkdir data\vectordb
   ```

5. **Set Environment Variables** (in the same command prompt)
   ```cmd
   set DATABASE_URL=postgresql://user:password@localhost:5432/finverse
   set GOOGLE_API_KEY=your-google-api-key-here
   set PYTHONPATH=%cd%\src;%PYTHONPATH%
   ```

6. **Start the Application**
   ```cmd
   python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8085
   ```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/finverse

# Google AI Configuration
GOOGLE_API_KEY=your-google-api-key-here

# Optional: Application Settings
PORT=8085
ENVIRONMENT=development
LOG_LEVEL=INFO
```

## Common Windows Issues and Solutions

### Issue 1: "python is not recognized"
**Solution:**
- Reinstall Python and ensure "Add to PATH" is checked
- Or manually add Python to your PATH environment variable

### Issue 2: PowerShell Execution Policy Error
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Port Already in Use
**Solution:**
- Change the port in the startup command:
  ```cmd
  python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8086
  ```

### Issue 4: Database Connection Issues
**Solution:**
- Verify PostgreSQL is running
- Check firewall settings
- Ensure the DATABASE_URL format is correct:
  ```
  postgresql://username:password@host:port/database
  ```

### Issue 5: Path Separator Issues
**Solution:**
- The application now uses cross-platform path management
- All paths are automatically converted to Windows format

### Issue 6: Virtual Environment Activation Issues
**Solution:**
- Use the full path to activate script:
  ```cmd
  C:\path\to\project\venv\Scripts\activate
  ```

## File Paths and Data Storage

The application uses the following directory structure on Windows:

```
FinVerse\apps\backend\chatbot-service\
├── data\                          # Data storage directory
│   ├── chat_history.sqlite        # Chat history database
│   └── vectordb\                  # Vector database files
│       └── chroma.sqlite3
├── static\                        # Static web files
│   ├── index.html
│   ├── app.js
│   └── style.css
├── src\                          # Source code
└── venv\                         # Virtual environment
```

All paths are automatically handled by the new path management system, ensuring compatibility between Windows and Unix systems.

## Testing the Installation

1. **Access the Web Interface**
   - Open your browser and go to `http://localhost:8085`

2. **Check API Documentation**
   - Visit `http://localhost:8085/docs` for interactive API documentation

3. **Test Basic Functionality**
   - Try the chat endpoint with a simple query
   - Check the product comparison features

4. **Run the Test Script**
   ```cmd
   python test_features.py
   ```

## Troubleshooting

### Enable Debug Logging
Add this to your `.env` file:
```env
LOG_LEVEL=DEBUG
```

### Check Application Logs
The application logs will appear in the command prompt/PowerShell window where you started the service.

### Reset Data
To reset all data:
```cmd
rmdir /s data
```
Then restart the application.

## Performance Considerations

- **Windows Defender**: Add the project folder to Windows Defender exclusions for better performance
- **Antivirus**: Some antivirus software may slow down Python operations
- **SSD Storage**: Store the vector database on an SSD for better performance

## Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the GitHub repository for known issues
5. Look at the application logs for detailed error information

## Next Steps

Once the application is running successfully:

1. Explore the API documentation at `/docs`
2. Test the product comparison features
3. Try the chat functionality
4. Import your financial product data
5. Customize the application for your needs

---

**Note:** This application has been designed with cross-platform compatibility in mind, so all path-related issues should be automatically handled on Windows systems.
