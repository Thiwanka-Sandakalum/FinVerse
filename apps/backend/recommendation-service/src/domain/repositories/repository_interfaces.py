"""
Repository interfaces for the recommendation service domain.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any

from ..entities.recommendation_entities import UserInteraction


class InteractionRepositoryInterface(ABC):
    """Interface for interaction data repository."""
    
    @abstractmethod
    async def get_user_interactions(
        self, 
        user_id: str, 
        limit: int = 100
    ) -> List[UserInteraction]:
        """Get interactions for a specific user."""
        pass
    
    @abstractmethod
    async def get_session_interactions(
        self, 
        session_id: str, 
        limit: int = 100
    ) -> List[UserInteraction]:
        """Get interactions for a specific session."""
        pass
    
    @abstractmethod
    async def get_all_user_product_interactions(
        self, 
        limit: int = 10000
    ) -> List[UserInteraction]:
        """Get all user-product interactions for training."""
        pass
    
    @abstractmethod
    async def get_most_viewed_products(
        self, 
        count: int = 5
    ) -> List[Dict[str, Any]]:
        """Get the most viewed products."""
        pass
    
    @abstractmethod
    async def get_user_preferences(
        self, 
        user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get preferences for a specific user."""
        pass


class ProductRepositoryInterface(ABC):
    """Interface for product data repository."""
    
    @abstractmethod
    async def get_product_details(
        self, 
        product_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get details for a single product."""
        pass
    
    @abstractmethod
    async def get_product_details_batch(
        self, 
        product_ids: List[str]
    ) -> Dict[str, Dict[str, Any]]:
        """Get details for multiple products in a single call."""
        pass


class ModelPersistenceRepositoryInterface(ABC):
    """Interface for model persistence."""
    
    @abstractmethod
    async def save_model(
        self, 
        model_data: bytes, 
        model_type: str
    ) -> None:
        """Save model data to persistent storage."""
        pass
    
    @abstractmethod
    async def load_model(
        self, 
        model_type: str
    ) -> Optional[bytes]:
        """Load model data from persistent storage."""
        pass
    
    @abstractmethod
    async def model_exists(
        self, 
        model_type: str
    ) -> bool:
        """Check if a model exists in storage."""
        pass