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
    text: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    relevance: Optional[float] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    conversation_id: str
    query_type: Optional[Literal["sql", "vector", "hybrid", "unsupported", "product_specific"]] = None
    history: Optional[List[Message]] = None

class ProductChatRequest(BaseModel):
    query: str
    product_id: str
    conversation_id: Optional[str] = None
    include_history: Optional[bool] = True

class ProductComparisonRequest(BaseModel):
    product_ids: List[str]

class ProductComparisonResponse(BaseModel):
    summary: str
    comparison: Dict[str, Any]
    products: List[Dict[str, Any]]

class IngestResponse(BaseModel):
    status: str
    message: str
    ingested_count: int
