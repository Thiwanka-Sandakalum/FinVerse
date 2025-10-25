"""
Domain entities for the recommendation service.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional, TypedDict


class ModelRefreshResult(TypedDict, total=False):
    """Type definition for model refresh result."""
    success: bool
    duration_seconds: float
    timestamp: str
    num_users: int
    num_products: int
    error: Optional[str]


@dataclass(frozen=True)
class UserInteraction:
    """Represents a user interaction with a product."""
    user_id: str
    session_id: Optional[str]
    interaction_type: str
    timestamp: datetime
    data: Dict[str, Any]
    
    @property
    def product_id(self) -> Optional[str]:
        """Extract product ID from interaction data."""
        return self.data.get("productId")
    
    @property
    def product_ids(self) -> List[str]:
        """Extract product IDs from interaction data."""
        product_ids: List[str] = []
        if "productIDs" in self.data and isinstance(self.data["productIDs"], list):
            for pid in self.data["productIDs"]:
                if pid is not None:
                    product_ids.append(str(pid))
        elif "productId" in self.data and self.data["productId"] is not None:
            product_ids.append(str(self.data["productId"]))
        return product_ids
    
    @property
    def category(self) -> Optional[str]:
        """Extract category from interaction data."""
        return self.data.get("category")
    
    @property
    def institution(self) -> Optional[str]:
        """Extract institution from interaction data."""
        return self.data.get("institution")
    
    @property
    def view_duration(self) -> Optional[int]:
        """Extract view duration from interaction data."""
        return self.data.get("viewDuration")
    
    @property
    def user_demographics(self) -> Optional[Dict[str, Any]]:
        """Extract user demographics from interaction data."""
        return self.data.get("userDemographics")


@dataclass(frozen=True)
class ProductRecommendation:
    """Represents a product recommendation."""
    id: str
    relevance_score: float
    rank: int
    details: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary format for API responses."""
        result: Dict[str, Any] = {
            "id": self.id,
            "relevanceScore": self.relevance_score,
            "rank": self.rank,
        }
        if self.details:
            result.update(self.details)
        return result


@dataclass(frozen=True)
class UserFeatures:
    """Represents user features for the recommendation model."""
    user_id: str
    features: List[str]
    
    def add_feature(self, feature: str) -> "UserFeatures":
        """Add a feature and return new instance (immutable)."""
        return UserFeatures(
            user_id=self.user_id,
            features=self.features + [feature]
        )


@dataclass(frozen=True)
class ProductFeatures:
    """Represents product features for the recommendation model."""
    product_id: str
    features: List[str]
    
    def add_feature(self, feature: str) -> "ProductFeatures":
        """Add a feature and return new instance (immutable)."""
        return ProductFeatures(
            product_id=self.product_id,
            features=self.features + [feature]
        )


class RecommendationModelInterface(ABC):
    """Interface for recommendation models."""
    
    @abstractmethod
    async def train(self, interactions: List[UserInteraction]) -> None:
        """Train the model with user interactions."""
        pass
    
    @abstractmethod
    async def predict_for_user(
        self, 
        user_id: str, 
        count: int
    ) -> List[ProductRecommendation]:
        """Get recommendations for a specific user."""
        pass
    
    @abstractmethod
    async def predict_similar_products(
        self, 
        product_id: str, 
        count: int
    ) -> List[ProductRecommendation]:
        """Get similar products for a given product."""
        pass
    
    @abstractmethod
    def is_ready(self) -> bool:
        """Check if the model is ready for predictions."""
        pass
    
    @abstractmethod
    async def save(self, path: str) -> None:
        """Save the model to a file."""
        pass
    
    @abstractmethod
    async def load(self, path: str) -> None:
        """Load the model from a file."""
        pass