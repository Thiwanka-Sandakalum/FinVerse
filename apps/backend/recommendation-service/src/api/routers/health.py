"""
Health check endpoint for the recommendation service.
"""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from datetime import datetime

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)

@router.get("/")
async def health_check():
    """
    Check the health of the recommendation service.
    
    Returns:
        dict: Health status information
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "service": "recommendation-service",
            "version": "1.0.0"
        }
    )
