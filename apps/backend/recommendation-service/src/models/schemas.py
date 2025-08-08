"""
Model definitions for the recommendation system.
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class RecommendationRequest(BaseModel):
    """Request model for recommendation API"""
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    count: int = Field(5, description="Number of recommendations to return")

class ProductRecommendation(BaseModel):
    """Model for product recommendation"""
    id: str = Field(..., description="Product ID")
    name: str = Field(..., description="Product name")
    description: Optional[str] = Field(None, description="Product description")
    category: Optional[str] = Field(None, description="Product category")
    category_id: Optional[str] = Field(None, description="Category ID")
    type: Optional[str] = Field(None, description="Product type")
    type_id: Optional[str] = Field(None, description="Type ID")
    institution_name: Optional[str] = Field(None, description="Institution name")
    institution_id: Optional[str] = Field(None, description="Institution ID")
    tags: Optional[List[str]] = Field(None, description="Product tags")
    features: Optional[Dict[str, Any]] = Field(None, description="Product features")
    relevance_score: float = Field(..., description="Relevance score")
    rank: int = Field(..., description="Recommendation rank")

class RecommendationResponse(BaseModel):
    """Response model for recommendation API"""
    recommendations: List[ProductRecommendation]
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    
class InteractionEvent(BaseModel):
    """Model for interaction event"""
    user_id: Optional[str] = None
    product_id: Optional[str] = None
    action: str
    session_id: Optional[str] = None
    source: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class ModelRefreshRequest(BaseModel):
    """Request model for model refresh API"""
    force: bool = Field(False, description="Force model refresh")

class ModelRefreshResponse(BaseModel):
    """Response model for model refresh API"""
    success: bool
    message: str
    details: Optional[Dict[str, Any]] = None
