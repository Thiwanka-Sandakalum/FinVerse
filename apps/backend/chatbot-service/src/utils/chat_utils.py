"""
Chat session management utilities for maintaining conversation history.
"""

from typing import Dict, List, Optional, Any
import uuid
import time
from datetime import datetime

class Message:
    """A single message in a chat conversation."""
    
    def __init__(self, text: str, role: str = "user", timestamp: Optional[datetime] = None):
        self.text = text
        self.role = role  # "user" or "assistant"
        self.timestamp = timestamp or datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the message to a dictionary representation."""
        return {
            "text": self.text,
            "role": self.role,
            "timestamp": self.timestamp.isoformat()
        }


class ChatSession:
    """Represents a chat session with message history."""
    
    def __init__(self, session_id: Optional[str] = None, max_history: int = 10):
        self.session_id = session_id or str(uuid.uuid4())
        self.messages: List[Message] = []
        self.created_at = datetime.now()
        self.last_updated = self.created_at
        self.max_history = max_history
    
    def add_message(self, text: str, role: str = "user") -> None:
        """Add a message to the chat history."""
        self.messages.append(Message(text, role))
        self.last_updated = datetime.now()
        
        # Trim history if it exceeds max_history
        if len(self.messages) > self.max_history * 2:  # Keep pairs of messages
            self.messages = self.messages[-self.max_history*2:]
    
    def get_history(self) -> List[Dict[str, Any]]:
        """Get the message history as a list of dictionaries."""
        return [msg.to_dict() for msg in self.messages]
    
    def get_history_as_string(self) -> str:
        """Get the message history as a formatted string for context."""
        history = []
        for msg in self.messages:
            prefix = "User: " if msg.role == "user" else "Assistant: "
            history.append(f"{prefix}{msg.text}")
        return "\n".join(history)


class ChatSessionManager:
    """Manages multiple chat sessions."""
    
    def __init__(self, session_ttl: int = 3600, cleanup_interval: int = 300):
        self.sessions: Dict[str, ChatSession] = {}
        self.session_ttl = session_ttl  # Time to live in seconds (1 hour default)
        self.cleanup_interval = cleanup_interval  # Cleanup interval in seconds
        self.last_cleanup = time.time()
    
    def get_session(self, session_id: Optional[str] = None) -> ChatSession:
        """Get an existing session or create a new one if it doesn't exist."""
        self._maybe_cleanup()
        
        # If no session_id provided or session doesn't exist, create a new one
        if not session_id or session_id not in self.sessions:
            session = ChatSession()
            self.sessions[session.session_id] = session
            return session
        
        return self.sessions[session_id]
    
    def add_message(self, session_id: str, text: str, role: str = "user") -> None:
        """Add a message to a session."""
        session = self.get_session(session_id)
        session.add_message(text, role)
    
    def get_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get the message history for a session."""
        session = self.get_session(session_id)
        return session.get_history()
    
    def _maybe_cleanup(self) -> None:
        """Periodically clean up expired sessions."""
        current_time = time.time()
        if current_time - self.last_cleanup < self.cleanup_interval:
            return
            
        self.last_cleanup = current_time
        expired_time = datetime.now().timestamp() - self.session_ttl
        
        # Remove expired sessions
        expired_sessions = [
            session_id for session_id, session in self.sessions.items()
            if session.last_updated.timestamp() < expired_time
        ]
        
        for session_id in expired_sessions:
            del self.sessions[session_id]


# Global instance of the chat session manager
chat_manager = ChatSessionManager()
