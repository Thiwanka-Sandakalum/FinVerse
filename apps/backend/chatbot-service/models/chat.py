import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), index=True, nullable=False)
    created_at = Column(DateTime, server_default="CURRENT_TIMESTAMP")
    updated_at = Column(DateTime, server_default="CURRENT_TIMESTAMP", onupdate=datetime.utcnow)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_user_id", "user_id"),
    )

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), index=True, nullable=False)
    role = Column(String(16), nullable=False)
    content = Column(Text, nullable=False)
    product_refs = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default="CURRENT_TIMESTAMP")

    session = relationship("ChatSession", back_populates="messages")

    __table_args__ = (
        Index("idx_session_id", "session_id"),
        Index("idx_user_id", "user_id"),
    )
