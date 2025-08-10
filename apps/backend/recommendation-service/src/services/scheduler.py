"""
Scheduler for periodic model refreshing.
"""
import asyncio
import logging
from datetime import datetime, timedelta
from typing import TypedDict

from services.recommendation_service import RecommendationService
from config import settings

logger = logging.getLogger("recommendation-service")

class ModelRefreshResult(TypedDict, total=False):
    """Type definition for model refresh result"""
    success: bool
    duration_seconds: float
    timestamp: str
    num_users: int
    num_products: int
    error: str

class ModelRefreshScheduler:
    """Scheduler for periodically refreshing the recommendation model"""
    task: asyncio.Task[None] | None
    
    def __init__(self, recommendation_service: RecommendationService):
        """
        Initialize the model refresh scheduler.
        
        Args:
            recommendation_service: Recommendation service instance
        """
        self.recommendation_service = recommendation_service
        self.refresh_interval = settings.MODEL_REFRESH_INTERVAL  # seconds
        self.is_running = False
        self.task = None
        self.last_refresh = None
    
    async def start(self):
        """Start the scheduler"""
        if self.is_running:
            logger.warning("Scheduler is already running")
            return
        
        self.is_running = True
        logger.info(f"Starting model refresh scheduler with interval {self.refresh_interval} seconds")
        
        # Create a background task for periodic model refresh
        self.task = asyncio.create_task(self._periodic_refresh())
    
    async def stop(self):
        """Stop the scheduler"""
        if not self.is_running:
            return
        
        self.is_running = False
        
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
            
        logger.info("Model refresh scheduler stopped")
    
    async def refresh_now(self) -> ModelRefreshResult:
        """
        Trigger an immediate model refresh.
        
        Returns:
            Result of the refresh operation
        """
        logger.info("Triggering immediate model refresh")
        result = await self.recommendation_service.refresh_model()
        
        if result.get("success", False):
            self.last_refresh = datetime.now()
        
        return result  # type: ignore
    
    async def _periodic_refresh(self):
        """Periodically refresh the model at the configured interval"""
        try:
            # Initial delay
            await asyncio.sleep(10)  # Wait for service to fully start
            
            # Refresh once at startup
            if not self.last_refresh:
                logger.info("Performing initial model refresh")
                result = await self.recommendation_service.refresh_model()
                if isinstance(result, dict) and result.get("success", False):
                    self.last_refresh = datetime.now()
                else:
                    logger.error(f"Initial model refresh failed: {result}")
            
            # Then refresh periodically
            while self.is_running:
                next_refresh_time = (self.last_refresh if self.last_refresh else datetime.now()) + \
                                   timedelta(seconds=self.refresh_interval)
                
                # Wait until next refresh time
                while datetime.now() < next_refresh_time and self.is_running:
                    await asyncio.sleep(60)  # Check every minute
                
                if not self.is_running:
                    break
                
                # Time to refresh
                logger.info("Performing scheduled model refresh")
                result = await self.recommendation_service.refresh_model()
                
                if result.get("success", False):
                    self.last_refresh = datetime.now()
                else:
                    logger.error(f"Scheduled model refresh failed: {result.get('error', 'Unknown error')}")
                    # Wait before retrying
                    await asyncio.sleep(600)  # 10 minutes
        
        except asyncio.CancelledError:
            logger.info("Model refresh task cancelled")
        except Exception as e:
            logger.error(f"Error in model refresh task: {str(e)}")
            
            # Try to restart
            if self.is_running:
                await asyncio.sleep(600)  # Wait before restarting
                self.task = asyncio.create_task(self._periodic_refresh())
