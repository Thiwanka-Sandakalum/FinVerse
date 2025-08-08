"""
SQLite service for persisting chat history.
"""

import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional, Union
from datetime import datetime, timedelta
from src.models.api_models import Message
from src.utils.paths import path_manager

logger = logging.getLogger(__name__)

class ChatHistoryService:
    """Service to manage chat history in SQLite database."""
    
    def __init__(self, db_path: Optional[str] = None):
        """Initialize the chat history service with database path."""
        if db_path is None:
            db_path = path_manager.chat_history_db_str
        self.db_path = db_path
        self.initialize_db()
    
    def initialize_db(self):
        """Create database and tables if they don't exist."""
        # Ensure data directory exists using path manager
        path_manager.ensure_data_directories()
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create conversations table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            ''')
            
            # Create messages table
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT NOT NULL,
                role TEXT NOT NULL,
                text TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                FOREIGN KEY (conversation_id) REFERENCES conversations (id)
            )
            ''')
            
            conn.commit()
            logger.info("Chat history database initialized")
        except Exception as e:
            logger.error(f"Failed to initialize chat history database: {str(e)}")
        finally:
            if conn:
                conn.close()
    
    def create_conversation(self, conversation_id: str) -> bool:
        """Create a new conversation entry."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            now = datetime.now().isoformat()
            cursor.execute(
                "INSERT OR IGNORE INTO conversations (id, created_at, updated_at) VALUES (?, ?, ?)",
                (conversation_id, now, now)
            )
            
            conn.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to create conversation: {str(e)}")
            return False
        finally:
            if conn:
                conn.close()
    
    def add_message(self, conversation_id: str, text: str, role: str) -> bool:
        """Add a message to a conversation."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ensure conversation exists
            self.create_conversation(conversation_id)
            
            # Update conversation's updated_at timestamp
            now = datetime.now().isoformat()
            cursor.execute(
                "UPDATE conversations SET updated_at = ? WHERE id = ?",
                (now, conversation_id)
            )
            
            # Insert message
            cursor.execute(
                "INSERT INTO messages (conversation_id, role, text, timestamp) VALUES (?, ?, ?, ?)",
                (conversation_id, role, text, now)
            )
            
            conn.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to add message: {str(e)}")
            return False
        finally:
            if conn:
                conn.close()
    
    def get_conversation_history(self, conversation_id: str, limit: int = 20) -> List[Message]:
        """Get message history for a conversation."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                "SELECT role, text, timestamp FROM messages WHERE conversation_id = ? ORDER BY id ASC LIMIT ?",
                (conversation_id, limit)
            )
            
            messages = []
            for row in cursor.fetchall():
                role, text, timestamp = row
                messages.append(Message(
                    role=role,
                    text=text,
                    timestamp=timestamp
                ))
            
            return messages
        except Exception as e:
            logger.error(f"Failed to get conversation history: {str(e)}")
            return []
        finally:
            if conn:
                conn.close()
    
    def get_conversation_history_as_string(self, conversation_id: str, limit: int = 10) -> str:
        """Get conversation history as a formatted string."""
        messages = self.get_conversation_history(conversation_id, limit)
        
        history = []
        for msg in messages:
            prefix = "User: " if msg.role == "user" else "Assistant: "
            history.append(f"{prefix}{msg.text}")
        
        return "\n".join(history)
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation and all its messages."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Delete messages first (foreign key constraint)
            cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))
            
            # Delete conversation
            cursor.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
            
            conn.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to delete conversation: {str(e)}")
            return False
        finally:
            if conn:
                conn.close()
    
    def get_all_conversations(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get a list of all conversations."""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute(
                "SELECT id, created_at, updated_at FROM conversations ORDER BY updated_at DESC LIMIT ?",
                (limit,)
            )
            
            conversations = []
            for row in cursor.fetchall():
                conversations.append({
                    "id": row["id"],
                    "created_at": row["created_at"],
                    "updated_at": row["updated_at"]
                })
            
            return conversations
        except Exception as e:
            logger.error(f"Failed to get all conversations: {str(e)}")
            return []
        finally:
            if conn:
                conn.close()
    
    def cleanup_old_conversations(self, days: int = 30) -> int:
        """Delete conversations older than specified days."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Calculate cutoff date
            cutoff_date = (datetime.now() - timedelta(days=days)).isoformat()
            
            # Get conversations to delete
            cursor.execute(
                "SELECT id FROM conversations WHERE updated_at < ?",
                (cutoff_date,)
            )
            conversation_ids = [row[0] for row in cursor.fetchall()]
            
            # Delete messages for these conversations
            for conv_id in conversation_ids:
                cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
            
            # Delete conversations
            cursor.execute("DELETE FROM conversations WHERE updated_at < ?", (cutoff_date,))
            
            deleted_count = len(conversation_ids)
            conn.commit()
            
            return deleted_count
        except Exception as e:
            logger.error(f"Failed to cleanup old conversations: {str(e)}")
            return 0
        finally:
            if conn:
                conn.close()
