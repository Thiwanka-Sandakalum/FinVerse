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

# Product comparison models
class ProductComparisonRequest(BaseModel):
    product_ids: List[str]
    comparison_fields: Optional[List[str]] = None  # Specific fields to compare

class ComparisonField(BaseModel):
    field_name: str
    field_label: str
    values: Dict[str, Any]  # product_id -> value mapping
    best_option: Optional[str] = None  # product_id with best value
    notes: Optional[str] = None

class ProductComparison(BaseModel):
    products: List[Dict[str, Any]]  # Full product details
    comparison_fields: List[ComparisonField]
    summary: Dict[str, Any]  # Summary statistics and recommendations

class ProductComparisonResponse(BaseModel):
    status: str
    comparison: ProductComparison
    comparison_id: str  # For follow-up questions

# Product-specific chat models
class ProductChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    include_history: Optional[bool] = True
    include_comparison: Optional[bool] = False  # Include comparison context if available

class ProductChatResponse(BaseModel):
    answer: str
    product_context: Dict[str, Any]  # The specific product being discussed
    related_products: Optional[List[Dict[str, Any]]] = None  # Similar products
    sources: List[Source]
    conversation_id: str
    query_type: Optional[Literal["product_specific", "comparison_based", "general"]] = None
    history: Optional[List[Message]] = None

# Enhanced chat request for comparison follow-up
class ComparisonChatRequest(BaseModel):
    query: str
    comparison_id: str
    conversation_id: Optional[str] = None
    include_history: Optional[bool] = True

class ComparisonChatResponse(BaseModel):
    answer: str
    comparison_context: ProductComparison
    recommended_products: Optional[List[str]] = None  # product_ids
    sources: List[Source]
    conversation_id: str
    history: Optional[List[Message]] = None
