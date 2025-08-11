"""
Main application module.
"""
import uvicorn
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.core.logging import setup_logging
from src.core.config import settings
from src.api.routers import recommendations, health
from src.core.db.mongodb import init_db_connection, close_db_connection
from src.services.recommendation import get_recommendation_service
from src.services.scheduler import ModelRefreshScheduler

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="FinVerse Recommendation API",
    description="API for generating personalized product recommendations based on user interactions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS
)

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "success": False}
    )

# Include routers
app.include_router(health.router)
app.include_router(recommendations.router, prefix="/api/v1")

"""
Main application module.
"""
import uvicorn
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.core.logging import setup_logging
from src.core.config import settings
from src.api.routers import recommendations, health
from src.core.db.mongodb import init_db_connection, close_db_connection
from src.services.recommendation import get_recommendation_service
from src.services.scheduler import ModelRefreshScheduler
from src.services.queue_consumer import start_queue_consumer

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="FinVerse Recommendation API",
    description="API for generating personalized product recommendations based on user interactions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS
)

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "success": False}
    )

# Include routers
app.include_router(health.router)
app.include_router(recommendations.router, prefix="/api/v1")

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 STARTING RECOMMENDATION SERVICE...")
    
    # Connect to database
    await init_db_connection(app)
    print("✅ DATABASE CONNECTION INITIALIZED")

    # Create fake request with app scope
    fake_request = Request(scope={
        "type": "http",
        "app": app
    })

    # Get recommendation service (initializes model)
    recommendation_service = await get_recommendation_service(fake_request)
    print("✅ RECOMMENDATION MODEL INITIALIZED")

    # Initialize and start model refresh scheduler
    scheduler = ModelRefreshScheduler(recommendation_service)
    app.state.scheduler = scheduler
    await scheduler.start()
    print("✅ MODEL REFRESH SCHEDULER STARTED")

    # Start RabbitMQ queue consumer
    try:
        await start_queue_consumer(settings.MONGO_URI, settings.MONGO_DB)
        print("✅ RABBITMQ QUEUE CONSUMER STARTED")
        logger.info("RabbitMQ queue consumer started successfully")
    except Exception as e:
        print(f"⚠️ FAILED TO START QUEUE CONSUMER: {str(e)}")
        logger.warning(f"Failed to start queue consumer: {str(e)}")
        logger.info("Service will continue without queue consumer")

    print("🎉 RECOMMENDATION SERVICE FULLY STARTED!")
    logger.info("Recommendation service started")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup services on shutdown"""
    print("🛑 SHUTTING DOWN RECOMMENDATION SERVICE...")
    
    # Stop scheduler
    if hasattr(app.state, 'scheduler'):
        await app.state.scheduler.stop()
        print("✅ MODEL REFRESH SCHEDULER STOPPED")
    
    # Close database connection
    await close_db_connection(app)
    print("✅ DATABASE CONNECTION CLOSED")
    
    print("👋 RECOMMENDATION SERVICE STOPPED!")
    logger.info("Recommendation service stopped")

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=1,
        log_level="info",
        access_log=True
    )
