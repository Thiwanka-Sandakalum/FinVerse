"""
Recommendation API endpoints.
"""
import logging
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Request

from src.application.dto.recommendation_dto import (
    RecommendationResponse,
    RefreshModelResponse
)
from src.application.services.app_service import AppService
from src.shared.constants.model_constants import DEFAULT_RECOMMENDATIONS_COUNT
from src.shared.exceptions.exceptions import (
    ModelNotReadyError,
    ProductNotFoundError,
    UserNotFoundError
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/recommendations")


def get_app_service(request: Request) -> AppService:
    """Get the application service from the request."""
    return request.app.state.app_service


@router.get("/users/{user_id}/products", response_model=RecommendationResponse)
async def get_user_recommendations(
    user_id: str = Path(..., description="User ID to generate recommendations for"),
    count: int = Query(
        DEFAULT_RECOMMENDATIONS_COUNT, 
        description="Number of recommendations to return",
        ge=1,
        le=50
    ),
    app_service: AppService = Depends(get_app_service)
) -> RecommendationResponse:
    """
    Get personalized product recommendations for a specific user.
    
    Args:
        user_id: The ID of the user to get recommendations for
        count: Number of recommendations to return (1-50)
        app_service: Application service dependency
        
    Returns:
        List of recommended products with relevance scores
        
    Raises:
        HTTPException: If user not found or model not ready
    """
    try:
        recommendation_service = app_service.get_recommendation_service()
        recommendations = await recommendation_service.get_user_recommendations(
            user_id, count
        )
        
        return RecommendationResponse(
            success=True,
            recommendations=[rec.to_dict() for rec in recommendations],
            user_id=user_id,
            count=len(recommendations)
        )
        
    except UserNotFoundError as e:
        logger.warning(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail=str(e))
    
    except ModelNotReadyError as e:
        logger.error(f"Model not ready: {str(e)}")
        raise HTTPException(status_code=503, detail="Recommendation service temporarily unavailable")
    
    except Exception as e:
        logger.error(f"Error getting user recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/sessions/{session_id}/products", response_model=RecommendationResponse)
async def get_session_recommendations(
    session_id: str = Path(..., description="Session ID to generate recommendations for"),
    count: int = Query(
        DEFAULT_RECOMMENDATIONS_COUNT, 
        description="Number of recommendations to return",
        ge=1,
        le=50
    ),
    app_service: AppService = Depends(get_app_service)
) -> RecommendationResponse:
    """
    Get personalized product recommendations based on the current session.
    
    This endpoint is useful for anonymous users who don't have a user ID.
    
    Args:
        session_id: The ID of the current session
        count: Number of recommendations to return (1-50)
        app_service: Application service dependency
        
    Returns:
        List of recommended products with relevance scores
    """
    try:
        recommendation_service = app_service.get_recommendation_service()
        recommendations = await recommendation_service.get_session_recommendations(
            session_id, count
        )
        
        return RecommendationResponse(
            success=True,
            recommendations=[rec.to_dict() for rec in recommendations],
            session_id=session_id,
            count=len(recommendations)
        )
        
    except Exception as e:
        logger.error(f"Error getting session recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/products/{product_id}/similar", response_model=RecommendationResponse)
async def get_similar_products(
    product_id: str = Path(..., description="Product ID to find similar products for"),
    count: int = Query(
        DEFAULT_RECOMMENDATIONS_COUNT, 
        description="Number of recommendations to return",
        ge=1,
        le=50
    ),
    app_service: AppService = Depends(get_app_service)
) -> RecommendationResponse:
    """
    Get similar products to a given product.
    
    Args:
        product_id: The ID of the product to find similar products for
        count: Number of recommendations to return (1-50)
        app_service: Application service dependency
        
    Returns:
        List of similar products with similarity scores
        
    Raises:
        HTTPException: If product not found or model not ready
    """
    try:
        recommendation_service = app_service.get_recommendation_service()
        similar_products = await recommendation_service.get_similar_products(
            product_id, count
        )
        
        return RecommendationResponse(
            success=True,
            recommendations=[rec.to_dict() for rec in similar_products],
            product_id=product_id,
            count=len(similar_products)
        )
        
    except ProductNotFoundError as e:
        logger.warning(f"Product not found: {product_id}")
        raise HTTPException(status_code=404, detail=str(e))
    
    except ModelNotReadyError as e:
        logger.error(f"Model not ready: {str(e)}")
        raise HTTPException(status_code=503, detail="Recommendation service temporarily unavailable")
    
    except Exception as e:
        logger.error(f"Error getting similar products: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/refresh-model", response_model=RefreshModelResponse)
async def refresh_model(
    app_service: AppService = Depends(get_app_service)
) -> RefreshModelResponse:
    """
    Trigger a refresh of the recommendation model.
    
    This endpoint retrains the model with the latest interaction data.
    
    Args:
        app_service: Application service dependency
        
    Returns:
        Status of the model refresh operation
    """
    try:
        recommendation_service = app_service.get_recommendation_service()
        result = await recommendation_service.refresh_model()
        
        return RefreshModelResponse(
            success=result["success"],
            message="Model refresh completed" if result["success"] else "Model refresh failed",
            details=result
        )
        
    except Exception as e:
        logger.error(f"Error refreshing model: {str(e)}")
        return RefreshModelResponse(
            success=False,
            message="Model refresh failed",
            details={"error": str(e)}
        )