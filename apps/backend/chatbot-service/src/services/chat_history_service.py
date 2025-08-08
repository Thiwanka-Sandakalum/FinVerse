
"""
SQLite service for persisting chat history.
"""

import sqlite3
import logging
import os
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from src.models.api_models import Message

logger = logging.getLogger(__name__)

class ChatHistoryService:
    """Service to manage chat history in SQLite database."""
    
    def __init__(self, db_path: str = "data/chat_history.sqlite"):
        """Initialize the chat history service with database path."""
        self.db_path = db_path
        self.initialize_db()
    
    def initialize_db(self):
        """Create database and tables if they don't exist."""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Check if the conversations table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='conversations'")
            conversations_exists = cursor.fetchone() is not None
            
            if not conversations_exists:
                # Create conversations table with user_id field
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    user_id TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                ''')
            else:
                # Check if user_id column exists
                cursor.execute("PRAGMA table_info(conversations)")
                columns = [column[1] for column in cursor.fetchall()]
                
                # Add user_id column if it doesn't exist
                if "user_id" not in columns:
                    cursor.execute("ALTER TABLE conversations ADD COLUMN user_id TEXT")
                    logger.info("Added user_id column to conversations table")
            
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
    
    def create_conversation(self, conversation_id: str, user_id: Optional[str] = None) -> bool:
        """Create a new conversation entry."""
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            now = datetime.now().isoformat()
            cursor.execute(
                "INSERT OR IGNORE INTO conversations (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (conversation_id, user_id, now, now)
            )
            
            conn.commit()
            return True
        except Exception as e:
            logger.error(f"Failed to create conversation: {str(e)}")
            return False
        finally:
            if conn:
                conn.close()
    
    def add_message(self, conversation_id: str, text: str, role: str, user_id: Optional[str] = None) -> bool:
        """Add a message to a conversation."""
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Ensure conversation exists
            self.create_conversation(conversation_id, user_id)
            
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
        conn = None
        messages: List[Message] = []
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                "SELECT role, text, timestamp FROM messages WHERE conversation_id = ? ORDER BY id ASC LIMIT ?",
                (conversation_id, limit)
            )
            
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
        
        history: List[str] = []
        for msg in messages:
            prefix = "User: " if msg.role == "user" else "Assistant: "
            history.append(f"{prefix}{msg.text}")
        
        return "\n".join(history)
    
    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation and all its messages."""
        conn = None
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
    
    def get_all_conversations(self, limit: int = 100, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get a list of all conversations."""
        conn = None
        conversations: List[Dict[str, Any]] = []
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            if user_id:
                cursor.execute(
                    "SELECT id, user_id, created_at, updated_at FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT ?",
                    (user_id, limit)
                )
            else:
                cursor.execute(
                    "SELECT id, user_id, created_at, updated_at FROM conversations ORDER BY updated_at DESC LIMIT ?",
                    (limit,)
                )
            
            for row in cursor.fetchall():
                conversations.append({
                    "id": row["id"],
                    "user_id": row["user_id"],
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
        conn = None
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
                
    def get_user_conversations(self, user_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all conversations for a specific user."""
        return self.get_all_conversations(limit, user_id)
