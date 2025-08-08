"""
Cross-platform path utilities for Windows and Unix systems.

This module provides centralized path management to ensure compatibility
across different operating systems, particularly Windows and Linux/macOS.
"""

import os
from pathlib import Path
from typing import Optional

class PathManager:
    """Centralized path manager for cross-platform compatibility."""
    
    def __init__(self):
        # Get the root directory of the project (parent of src)
        self.src_dir = Path(__file__).parent.parent
        self.project_root = self.src_dir.parent
        
        # Define base directories
        self.data_dir = self.project_root / "data"
        self.static_dir = self.project_root / "static"
        self.src_services_dir = self.src_dir / "services"
        self.src_models_dir = self.src_dir / "models"
        self.src_utils_dir = self.src_dir / "utils"
        self.src_config_dir = self.src_dir / "config"
        self.src_scripts_dir = self.src_dir / "scripts"
        self.src_tests_dir = self.src_dir / "tests"
        
        # Vector database paths
        self.vectordb_dir = self.data_dir / "vectordb"
        self.vectordb_chroma_file = self.vectordb_dir / "chroma.sqlite3"
        
        # Chat history database path
        self.chat_history_db = self.data_dir / "chat_history.sqlite"
        
        # Static file paths
        self.index_html = self.static_dir / "index.html"
        self.app_js = self.static_dir / "app.js"
        self.style_css = self.static_dir / "style.css"
        
    def ensure_data_directories(self) -> None:
        """Create necessary data directories if they don't exist."""
        directories = [
            self.data_dir,
            self.vectordb_dir,
            self.static_dir
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    def get_absolute_path(self, relative_path: str) -> Path:
        """Convert a relative path string to absolute Path object."""
        return self.project_root / relative_path
    
    def get_data_file_path(self, filename: str) -> Path:
        """Get path for a file in the data directory."""
        return self.data_dir / filename
    
    def get_static_file_path(self, filename: str) -> Path:
        """Get path for a file in the static directory."""
        return self.static_dir / filename
    
    def normalize_path(self, path_str: str) -> str:
        """Normalize a path string for the current OS."""
        return str(Path(path_str).resolve())
    
    @property
    def data_dir_str(self) -> str:
        """Get data directory as string."""
        return str(self.data_dir)
    
    @property
    def vectordb_dir_str(self) -> str:
        """Get vector database directory as string."""
        return str(self.vectordb_dir)
    
    @property
    def chat_history_db_str(self) -> str:
        """Get chat history database path as string."""
        return str(self.chat_history_db)
    
    @property
    def static_dir_str(self) -> str:
        """Get static directory as string."""
        return str(self.static_dir)
    
    @property
    def index_html_str(self) -> str:
        """Get index.html path as string."""
        return str(self.index_html)

# Global instance
path_manager = PathManager()

def get_project_root() -> Path:
    """Get the project root directory."""
    return path_manager.project_root

def get_data_dir() -> Path:
    """Get the data directory."""
    return path_manager.data_dir

def get_static_dir() -> Path:
    """Get the static directory.""" 
    return path_manager.static_dir

def get_vectordb_dir() -> Path:
    """Get the vector database directory."""
    return path_manager.vectordb_dir

def get_chat_history_db_path() -> Path:
    """Get the chat history database path."""
    return path_manager.chat_history_db

def ensure_directories() -> None:
    """Ensure all necessary directories exist."""
    path_manager.ensure_data_directories()

def safe_path_join(*args) -> str:
    """Safely join path components for current OS."""
    return str(Path(*args))

def normalize_path_for_os(path_string: str) -> str:
    """Normalize a path string for the current operating system."""
    # Replace forward slashes with OS-appropriate separator
    if os.name == 'nt':  # Windows
        path_string = path_string.replace('/', os.sep)
    return os.path.normpath(path_string)
