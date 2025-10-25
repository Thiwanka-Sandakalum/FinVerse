"""
Data Transfer Objects for API responses.
"""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class RecommendationResponse(BaseModel):
    """Response schema for recommendation endpoints."""
    
    success: bool = Field(description="Whether the request was successful")
    recommendations: List[Dict[str, Any]] = Field(
        description="List of recommended products"
    )
    user_id: Optional[str] = Field(
        default=None, 
        description="User ID (for user-based recommendations)"
    )
    session_id: Optional[str] = Field(
        default=None, 
        description="Session ID (for session-based recommendations)"
    )
    product_id: Optional[str] = Field(
        default=None, 
        description="Product ID (for similar product recommendations)"
    )
    count: int = Field(description="Number of recommendations returned")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "recommendations": [
                    {
                        "id": "product-123",
                        "name": "Premium Savings Account", 
                        "relevanceScore": 0.95,
                        "rank": 1,
                        "category": "Savings",
                        "institution": "Example Bank"
                    }
                ],
                "user_id": "user-456",
                "count": 1
            }
        }


class RefreshModelResponse(BaseModel):
    """Response schema for model refresh endpoint."""
    
    success: bool = Field(description="Whether the refresh was successful")
    message: str = Field(description="Status message")
    details: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional details about the refresh operation"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Model refresh completed",
                "details": {
                    "duration_seconds": 45.2,
                    "num_users": 1250,
                    "num_products": 340,
                    "timestamp": "2024-01-01T12:00:00Z"
                }
            }
        }