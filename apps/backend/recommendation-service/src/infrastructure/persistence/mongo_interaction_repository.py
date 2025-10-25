"""
MongoDB implementation of repository interfaces.
"""
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

import motor.motor_asyncio

from ...domain.entities.recommendation_entities import UserInteraction
from ...domain.repositories.repository_interfaces import (
    InteractionRepositoryInterface
)
from ...shared.exceptions.exceptions import DatabaseConnectionError

logger = logging.getLogger(__name__)


class MongoInteractionRepository(InteractionRepositoryInterface):
    """MongoDB implementation of interaction repository."""
    
    def __init__(self, database: motor.motor_asyncio.AsyncIOMotorDatabase) -> None:
        """
        Initialize the MongoDB interaction repository.
        
        Args:
            database: MongoDB database instance
        """
        self.db = database
        self.collection = database.interactions
    
    async def get_user_interactions(
        self, 
        user_id: str, 
        limit: int = 100
    ) -> List[UserInteraction]:
        """Get interactions for a specific user."""
        try:
            cursor = self.collection.find(
                {"user_id": user_id}
            ).sort("timestamp", -1).limit(limit)
            
            documents = await cursor.to_list(length=limit)
            return [self._document_to_interaction(doc) for doc in documents]
            
        except Exception as e:
            logger.error(f"Error getting user interactions: {str(e)}")
            raise DatabaseConnectionError(
                f"Failed to retrieve user interactions for {user_id}",
                {"user_id": user_id, "error": str(e)}
            )
    
    async def get_session_interactions(
        self, 
        session_id: str, 
        limit: int = 100
    ) -> List[UserInteraction]:
        """Get interactions for a specific session."""
        try:
            cursor = self.collection.find(
                {"session_id": session_id}
            ).sort("timestamp", -1).limit(limit)
            
            documents = await cursor.to_list(length=limit)
            return [self._document_to_interaction(doc) for doc in documents]
            
        except Exception as e:
            logger.error(f"Error getting session interactions: {str(e)}")
            raise DatabaseConnectionError(
                f"Failed to retrieve session interactions for {session_id}",
                {"session_id": session_id, "error": str(e)}
            )
    
    async def get_all_user_product_interactions(
        self, 
        limit: int = 10000
    ) -> List[UserInteraction]:
        """Get all user-product interactions for training."""
        try:
            pipeline = [
                {
                    "$match": {
                        "type": {"$in": ["product_view", "comparison", "interaction"]},
                        "user_id": {"$exists": True, "$ne": None},
                        "$or": [
                            {"data.productId": {"$exists": True, "$ne": None}},
                            {"data.productIDs": {"$exists": True, "$ne": []}}
                        ]
                    }
                },
                {"$sort": {"timestamp": -1}},
                {"$limit": limit}
            ]
            
            cursor = self.collection.aggregate(pipeline)
            documents = await cursor.to_list(length=limit)
            return [self._document_to_interaction(doc) for doc in documents]
            
        except Exception as e:
            logger.error(f"Error getting all user-product interactions: {str(e)}")
            raise DatabaseConnectionError(
                "Failed to retrieve user-product interactions",
                {"error": str(e)}
            )
    
    async def get_most_viewed_products(
        self, 
        count: int = 5
    ) -> List[Dict[str, Any]]:
        """Get the most viewed products."""
        try:
            pipeline = [
                {
                    "$match": {
                        "type": "product_view", 
                        "data.productId": {"$exists": True, "$ne": None}
                    }
                },
                {
                    "$group": {
                        "_id": "$data.productId", 
                        "count": {"$sum": 1}
                    }
                },
                {"$sort": {"count": -1}},
                {"$limit": count}
            ]
            
            cursor = self.collection.aggregate(pipeline)
            documents = await cursor.to_list(length=count)
            
            return [
                {"productId": doc["_id"], "count": doc["count"]} 
                for doc in documents
            ]
            
        except Exception as e:
            logger.error(f"Error getting most viewed products: {str(e)}")
            raise DatabaseConnectionError(
                "Failed to retrieve most viewed products",
                {"error": str(e)}
            )
    
    async def get_user_preferences(
        self, 
        user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get preferences for a specific user."""
        try:
            document = await self.collection.find_one(
                {"type": "preference", "user_id": user_id}
            )
            return document
            
        except Exception as e:
            logger.error(f"Error getting user preferences: {str(e)}")
            raise DatabaseConnectionError(
                f"Failed to retrieve preferences for user {user_id}",
                {"user_id": user_id, "error": str(e)}
            )
    
    def _document_to_interaction(self, document: Dict[str, Any]) -> UserInteraction:
        """Convert MongoDB document to UserInteraction entity."""
        # Handle different timestamp formats
        timestamp = document.get("timestamp")
        if isinstance(timestamp, str):
            # Try to parse ISO format string
            try:
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            except ValueError:
                timestamp = datetime.now()
        elif not isinstance(timestamp, datetime):
            timestamp = datetime.now()
        
        return UserInteraction(
            user_id=document.get("user_id", ""),
            session_id=document.get("session_id"),
            interaction_type=document.get("type", ""),
            timestamp=timestamp,
            data=document.get("data", {})
        )