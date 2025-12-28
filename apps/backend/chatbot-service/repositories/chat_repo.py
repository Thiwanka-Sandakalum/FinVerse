
from sqlalchemy.orm import Session
from typing import List, Optional
from models.chat import ChatSession, ChatMessage
from models.product import Product

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    # Create or get a chat session
    def get_or_create_session(self, session_id: str, user_id: str) -> ChatSession:
        session = self.db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not session:
            session = ChatSession(id=session_id, user_id=user_id)
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
        return session

    # Save a chat message
    def save_message(
        self,
        session_id: str,
        user_id: str,
        role: str,
        content: str,
        products: Optional[List[Product]] = None
    ) -> ChatMessage:
        # Ensure the chat session exists
        self.get_or_create_session(session_id, user_id)
        msg = ChatMessage(
            session_id=session_id,
            user_id=user_id,
            role=role,
            content=content
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    # Get recent messages for context
    def get_recent_messages(self, session_id: str, limit: int = 5) -> List[ChatMessage]:
        return (
            self.db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit)
            .all()
        )
