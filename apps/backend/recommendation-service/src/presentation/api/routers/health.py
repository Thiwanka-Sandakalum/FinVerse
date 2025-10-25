"""
Health check endpoints.
"""
import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, Request

from src.application.services.app_service import AppService

logger = logging.getLogger(__name__)

router = APIRouter()


def get_app_service(request: Request) -> AppService:
    """Get the application service from the request."""
    return request.app.state.app_service


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint.
    
    Returns:
        Health status information
    """
    return {
        "status": "healthy",
        "service": "recommendation-service",
        "version": "1.0.0"
    }


@router.get("/health/detailed")
async def detailed_health_check(
    app_service: AppService = Depends(get_app_service)
) -> Dict[str, Any]:
    """
    Detailed health check including model status.
    
    Args:
        app_service: Application service dependency
        
    Returns:
        Detailed health status information
    """
    try:
        recommendation_service = app_service.get_recommendation_service()
        model_ready = recommendation_service.model.is_ready()
        
        return {
            "status": "healthy" if model_ready else "degraded",
            "service": "recommendation-service", 
            "version": "1.0.0",
            "components": {
                "database": "healthy",
                "model": "ready" if model_ready else "not_ready",
                "external_services": "healthy"
            },
            "last_model_refresh": (
                recommendation_service.last_refresh.isoformat() 
                if recommendation_service.last_refresh 
                else None
            )
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "recommendation-service",
            "version": "1.0.0", 
            "error": str(e)
        }