from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime

class Message(BaseModel):
    text: str
    role: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    include_history: Optional[bool] = True

class Source(BaseModel):
    name: str
    institution: str
    product_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    conversation_id: str
    query_type: Optional[Literal["sql", "vector", "hybrid", "unsupported"]] = None
    history: Optional[List[Message]] = None

class IngestResponse(BaseModel):
    status: str
    message: str
    ingested_count: int
