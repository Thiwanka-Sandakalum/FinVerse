"""
FastAPI dependencies for the recommendation service.
"""
from fastapi import Request

from src.application.services.app_service import AppService


def get_app_service(request: Request) -> AppService:
    """
    Get the AppService instance from the request state.
    
    Args:
        request: FastAPI request object
        
    Returns:
        AppService instance
    """
    return request.app.state.app_service
