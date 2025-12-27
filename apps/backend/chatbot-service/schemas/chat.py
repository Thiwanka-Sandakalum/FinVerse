from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    sessionId: str
    message: str

class ProductChatRequest(BaseModel):
    sessionId: str
    productId: str
    message: str

class CompareRequest(BaseModel):
    productIds: List[str]

# Response models
class ChatMessageResponse(BaseModel):
    id: str
    sessionId: str
    userId: str
    role: str
    content: str
    productIds: Optional[List[str]] = None
    createdAt: str

class ChatResponse(BaseModel):
    reply: str
    referencedProducts: Optional[List[str]] = None
