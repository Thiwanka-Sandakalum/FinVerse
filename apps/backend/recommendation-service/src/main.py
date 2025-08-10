"""
Main entry point for the recommendation service FastAPI application.

This module initializes and configures the FastAPI application,
including routers, middleware, and database connections.
"""
import logging
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from api.routers import recommendations, health
from services.db_service import init_db_connection, close_db_connection
from services.scheduler import ModelRefreshScheduler
from services.recommendation_service import get_recommendation_service
from services.queue_consumer import start_queue_consumer
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("recommendation-service")

# Create FastAPI application
app = FastAPI(
    title="FinVerse Recommendation API",
    description="API for generating personalized product recommendations based on user interactions",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "success": False},
    )

# Include routers
app.include_router(health.router)
app.include_router(recommendations.router, prefix="/api/v1")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    # Connect to database
    await init_db_connection(app)

    # Get recommendation service (initializes model)
    recommendation_service = get_recommendation_service(app)

    # Initialize and start model refresh scheduler
    scheduler = ModelRefreshScheduler(recommendation_service)
    app.state.scheduler = scheduler
    await scheduler.start()

    # Start RabbitMQ queue consumer for user interactions
    logger.info("Starting RabbitMQ queue consumer...")
    start_queue_consumer()

    logger.info("Recommendation service started")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup services on shutdown"""
    # Stop scheduler
    if hasattr(app.state, 'scheduler'):
        await app.state.scheduler.stop()
    
    # Close database connection
    await close_db_connection(app)
    logger.info("Recommendation service stopped")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=4003, reload=True)
