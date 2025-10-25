"""
Model refresh scheduler for periodic model retraining.
"""
import asyncio
import logging
from typing import Optional

from ...domain.services.recommendation_domain_service import RecommendationDomainService

logger = logging.getLogger(__name__)


class ModelRefreshScheduler:
    """Scheduler for periodic model refresh operations."""
    
    def __init__(
        self, 
        recommendation_service: RecommendationDomainService,
        refresh_interval: int = 3600  # 1 hour default
    ) -> None:
        """
        Initialize the scheduler.
        
        Args:
            recommendation_service: Domain service to refresh models for
            refresh_interval: Refresh interval in seconds
        """
        self.recommendation_service = recommendation_service
        self.refresh_interval = refresh_interval
        self._task: Optional[asyncio.Task] = None
        self._stopped = False
    
    async def start(self) -> None:
        """Start the scheduler."""
        if self._task and not self._task.done():
            logger.warning("Scheduler is already running")
            return
        
        self._stopped = False
        self._task = asyncio.create_task(self._run_scheduler())
        logger.info(f"Model refresh scheduler started (interval: {self.refresh_interval}s)")
    
    async def stop(self) -> None:
        """Stop the scheduler."""
        self._stopped = True
        
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        
        logger.info("Model refresh scheduler stopped")
    
    async def _run_scheduler(self) -> None:
        """Main scheduler loop."""
        try:
            while not self._stopped:
                await asyncio.sleep(self.refresh_interval)
                
                if self._stopped:
                    break
                
                try:
                    logger.info("Starting scheduled model refresh...")
                    result = await self.recommendation_service.refresh_model()
                    
                    if result["success"]:
                        logger.info(
                            f"Scheduled model refresh completed in "
                            f"{result.get('duration_seconds', 0):.2f}s"
                        )
                    else:
                        logger.error(
                            f"Scheduled model refresh failed: {result.get('error', 'Unknown error')}"
                        )
                
                except Exception as e:
                    logger.error(f"Error during scheduled model refresh: {str(e)}")
                    # Continue the loop even if refresh fails
                    
        except asyncio.CancelledError:
            logger.info("Scheduler task cancelled")
            raise
        except Exception as e:
            logger.error(f"Scheduler error: {str(e)}")
            raise