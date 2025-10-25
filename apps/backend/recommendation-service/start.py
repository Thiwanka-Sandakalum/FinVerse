#!/usr/bin/env python3
"""
Simple startup script for the FinVerse Recommendation Service.
"""
import subprocess
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

def main():
    """Start the recommendation service."""
    # Ensure we're in the correct directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Load environment variables from .env file
    env_file = script_dir / ".env"
    if env_file.exists():
        print("📋 Loading environment from .env file...")
        load_dotenv(env_file)
    else:
        print("⚠️  No .env file found, using defaults")
    
    print("🚀 Starting FinVerse Recommendation Service...")
    print("📂 Working directory:", os.getcwd())
    
    # Print some config for debugging
    mongo_uri = os.getenv('DB_MONGODB_URI', 'mongodb://localhost:27017')
    print(f"🗄️  MongoDB URI: {mongo_uri[:50]}...")
    
    try:
        # Start the service using uvicorn directly
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            "src.main:app",
            "--host", "0.0.0.0",
            "--port", "4003",
            "--reload",
            "--log-level", "info"
        ], check=True, env=os.environ.copy())
        
    except KeyboardInterrupt:
        print("\n🛑 Service stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start service: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()