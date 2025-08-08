"""
Router for recommendation endpoints.
"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, Path
from pydantic import BaseModel

from services.recommendation_service import RecommendationService, get_recommendation_service

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)

class RecommendationResponse(BaseModel):
    """Schema for recommendation response"""
    recommendations: List[Dict[str, Any]]
    user_id: Optional[str] = None
    session_id: Optional[str] = None

@router.get("/products/{user_id}", response_model=RecommendationResponse)
async def get_product_recommendations(
    user_id: str = Path(..., description="User ID to generate recommendations for"),
    count: int = Query(5, description="Number of recommendations to return"),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Get personalized product recommendations for a specific user.
    
    Args:
        user_id: The ID of the user to get recommendations for
        count: Number of recommendations to return
        recommendation_service: Dependency-injected recommendation service
        
    Returns:
        dict: List of recommended products with relevance scores
    """
    recommendations = await recommendation_service.get_recommendations_for_user(user_id, count)
    return {"recommendations": recommendations, "user_id": user_id}

@router.get("/session/{session_id}", response_model=RecommendationResponse)
async def get_session_recommendations(
    session_id: str = Path(..., description="Session ID to generate recommendations for"),
    count: int = Query(5, description="Number of recommendations to return"),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Get personalized product recommendations based on the current session.
    
    This endpoint is useful for anonymous users who don't have a user ID.
    
    Args:
        session_id: The ID of the current session
        count: Number of recommendations to return
        recommendation_service: Dependency-injected recommendation service
        
    Returns:
        dict: List of recommended products with relevance scores
    """
    recommendations = await recommendation_service.get_recommendations_for_session(session_id, count)
    return {"recommendations": recommendations, "session_id": session_id}

@router.get("/similar-products/{product_id}", response_model=RecommendationResponse)
async def get_similar_products(
    product_id: str = Path(..., description="Product ID to find similar products for"),
    count: int = Query(5, description="Number of recommendations to return"),
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Get similar products to a given product.
    
    Args:
        product_id: The ID of the product to find similar products for
        count: Number of recommendations to return
        recommendation_service: Dependency-injected recommendation service
        
    Returns:
        dict: List of similar products with similarity scores
    """
    similar_products = await recommendation_service.get_similar_products(product_id, count)
    return {"recommendations": similar_products}

@router.post("/refresh-model")
async def refresh_model(
    recommendation_service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Trigger a refresh of the recommendation model.
    
    This endpoint retrains the model with the latest interaction data.
    
    Args:
        recommendation_service: Dependency-injected recommendation service
        
    Returns:
        dict: Status of the model refresh operation
    """
    result = await recommendation_service.refresh_model()
    return {"success": True, "message": "Model refresh initiated", "details": result}
