"""
Application service for dependency management and coordination.
"""
import asyncio
import logging
from typing import Optional

import motor.motor_asyncio

from ...domain.services.recommendation_domain_service import RecommendationDomainService
from ...infrastructure.external.banking_service_client import BankingServiceClient
from ...infrastructure.models.lightfm_model import LightFMRecommendationModel
from ...infrastructure.persistence.mongo_interaction_repository import (
    MongoInteractionRepository
)
from ...infrastructure.scheduling.model_refresh_scheduler import ModelRefreshScheduler
from ...shared.config.settings import settings
from ...shared.exceptions.exceptions import DatabaseConnectionError

logger = logging.getLogger(__name__)


class AppService:
    """
    Main application service that coordinates all dependencies.
    
    This service implements the dependency injection pattern and manages
    the lifecycle of all application components.
    """
    
    def __init__(self) -> None:
        """Initialize the application service."""
        # Database
        self.mongo_client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.mongo_db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None
        
        # Repositories
        self.interaction_repository: Optional[MongoInteractionRepository] = None
        self.product_repository: Optional[BankingServiceClient] = None
        
        # Model and domain service
        self.model: Optional[LightFMRecommendationModel] = None
        self.recommendation_service: Optional[RecommendationDomainService] = None
        
        # Background services
        self.scheduler: Optional[ModelRefreshScheduler] = None
        self._scheduler_task: Optional[asyncio.Task] = None
    
    async def initialize(self) -> None:
        """
        Initialize all application dependencies.
        
        Raises:
            DatabaseConnectionError: If database connection fails
        """
        logger.info("Initializing application dependencies...")
        
        # Initialize database connections
        await self._init_database()
        
        # Initialize repositories
        self._init_repositories()
        
        # Initialize model
        await self._init_model()
        
        # Initialize domain service
        self._init_domain_service()
        
        # Initialize background services
        await self._init_background_services()
        
        logger.info("Application dependencies initialized successfully")
    
    async def cleanup(self) -> None:
        """Clean up all resources."""
        logger.info("Cleaning up application resources...")
        
        # Stop background services
        if self._scheduler_task and not self._scheduler_task.done():
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass
        
        if self.scheduler:
            await self.scheduler.stop()
        
        # Close database connections
        if self.mongo_client:
            self.mongo_client.close()
        
        logger.info("Application cleanup completed")
    
    async def _init_database(self) -> None:
        """Initialize database connections."""
        try:
            logger.info("Connecting to MongoDB...")
            
            self.mongo_client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.database.mongodb_uri
            )
            
            self.mongo_db = self.mongo_client[settings.database.mongodb_database]
            
            # Test the connection
            await self.mongo_client.admin.command('ping')
            
            logger.info("✅ MongoDB connection established")
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise DatabaseConnectionError(
                "Failed to establish database connection",
                {"error": str(e)}
            )
    
    def _init_repositories(self) -> None:
        """Initialize repository instances."""
        logger.info("Initializing repositories...")
        
        # MongoDB interaction repository
        self.interaction_repository = MongoInteractionRepository(self.mongo_db)
        
        # Banking service client
        self.product_repository = BankingServiceClient(
            base_url=settings.external.banking_service_url,
            timeout=settings.external.banking_service_timeout
        )
        
        logger.info("✅ Repositories initialized")
    
    async def _init_model(self) -> None:
        """Initialize the recommendation model."""
        logger.info("Initializing recommendation model...")
        
        self.model = LightFMRecommendationModel(
            data_dir=settings.storage.data_dir,
            model_config={
                "no_components": settings.model.num_components,
                "learning_rate": settings.model.learning_rate,
                "loss": settings.model.loss,
                "user_alpha": settings.model.user_alpha,
                "item_alpha": settings.model.item_alpha,
                "max_sampled": settings.model.max_sampled,
                "epochs": settings.model.epochs,
            }
        )
        
        # Try to load existing model
        await self.model.load_if_exists()
        
        logger.info("✅ Recommendation model initialized")
    
    def _init_domain_service(self) -> None:
        """Initialize the domain service."""
        logger.info("Initializing domain service...")
        
        self.recommendation_service = RecommendationDomainService(
            model=self.model,
            interaction_repository=self.interaction_repository,
            product_repository=self.product_repository
        )
        
        logger.info("✅ Domain service initialized")
    
    async def _init_background_services(self) -> None:
        """Initialize background services like model refresh scheduler."""
        logger.info("Initializing background services...")
        
        # Model refresh scheduler
        self.scheduler = ModelRefreshScheduler(
            recommendation_service=self.recommendation_service,
            refresh_interval=settings.model.refresh_interval_seconds
        )
        
        # Start scheduler in background
        self._scheduler_task = asyncio.create_task(self.scheduler.start())
        
        # Initial model training if model is not ready
        if not self.model.is_ready():
            logger.info("Model not ready, triggering initial training...")
            asyncio.create_task(self.recommendation_service.refresh_model())
        
        logger.info("✅ Background services initialized")
    
    def get_recommendation_service(self) -> RecommendationDomainService:
        """
        Get the recommendation service instance.
        
        Returns:
            Recommendation domain service
            
        Raises:
            RuntimeError: If service is not initialized
        """
        if self.recommendation_service is None:
            raise RuntimeError("Application service not initialized")
        
        return self.recommendation_service