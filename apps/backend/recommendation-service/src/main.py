"""
Main FastAPI application for the recommendation service.

This module sets up the FastAPI application with proper dependency injection,
middleware, exception handling, and lifecycle management.
"""
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.application.services.app_service import AppService
from src.presentation.api.routers import health, recommendations
from src.shared.config.settings import settings
from src.shared.exceptions.exceptions import RecommendationServiceError
from src.shared.utils.logging import setup_logging

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager for startup and shutdown events.
    
    Args:
        app: FastAPI application instance
        
    Yields:
        None during application runtime
    """
    # Startup
    logger.info("🚀 Starting Recommendation Service...")
    
    try:
        # Initialize application service (handles all dependencies)
        app_service = AppService()
        await app_service.initialize()
        
        # Store app service in app state for dependency injection
        app.state.app_service = app_service
        
        logger.info("✅ Recommendation Service started successfully")
        
        yield
        
    finally:
        # Shutdown
        logger.info("🛑 Shutting down Recommendation Service...")
        
        if hasattr(app.state, 'app_service'):
            await app.state.app_service.cleanup()
        
        logger.info("👋 Recommendation Service stopped")


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application
    """
    app = FastAPI(
        title="FinVerse Recommendation API",
        description="API for generating personalized product recommendations",
        version=settings.service.version,
        lifespan=lifespan,
        debug=settings.service.debug
    )
    
    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors.allow_origins,
        allow_credentials=settings.cors.allow_credentials,
        allow_methods=settings.cors.allow_methods,
        allow_headers=settings.cors.allow_headers,
    )
    
    # Exception handlers
    configure_exception_handlers(app)
    
    # Include routers
    app.include_router(health.router, tags=["Health"])
    app.include_router(
        recommendations.router, 
        prefix=settings.api_prefix, 
        tags=["Recommendations"]
    )
    
    return app


def configure_exception_handlers(app: FastAPI) -> None:
    """
    Configure global exception handlers for the application.
    
    Args:
        app: FastAPI application to configure
    """
    
    @app.exception_handler(RecommendationServiceError)
    async def recommendation_service_exception_handler(
        request: Request, 
        exc: RecommendationServiceError
    ) -> JSONResponse:
        """Handle custom recommendation service exceptions."""
        logger.error(f"Recommendation service error: {exc.message}")
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": exc.message,
                "details": exc.details
            }
        )
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request, 
        exc: HTTPException
    ) -> JSONResponse:
        """Handle HTTP exceptions."""
        logger.warning(f"HTTP exception: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.detail
            }
        )
    
    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request, 
        exc: Exception
    ) -> JSONResponse:
        """Handle all other unhandled exceptions."""
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        
        if settings.service.debug:
            # Include stack trace in debug mode
            import traceback
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": "Internal server error",
                    "debug_info": traceback.format_exc()
                }
            )
        
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error"
            }
        )


# Create the application instance
app = create_app()


if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host=settings.service.host,
        port=settings.service.port,
        reload=settings.service.debug,
        log_level=settings.service.log_level.lower(),
        access_log=True,
        workers=1 if settings.service.debug else 4
    )
