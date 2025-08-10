"""
FastAPI dependencies for the recommendation service.
"""
from typing import AsyncGenerator
from fastapi import Request

from src.services.database import get_database
from src.services.recommendation import RecommendationService
from src.core.config import settings

async def get_recommendation_service(request: Request) -> AsyncGenerator[RecommendationService, None]:
    """
    Dependency for getting the recommendation service instance.
    
    Args:
        request: FastAPI request object
        
    Yields:
        RecommendationService instance
    """
    db = await get_database()
    recommendation_service = RecommendationService(db)
    yield recommendation_service
