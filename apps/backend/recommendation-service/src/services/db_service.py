"""
Database service for connecting to MongoDB and retrieving interaction data.
"""
import logging
import motor.motor_asyncio
from fastapi import FastAPI
from typing import List, Dict, Any

logger = logging.getLogger("recommendation-service")

async def init_db_connection(app: FastAPI):
    """
    Initialize database connections and attach them to the FastAPI app.
    
    Args:
        app: FastAPI application instance
    """
    # MongoDB connection settings - these should be in a config file
    MONGO_URI = "mongodb://localhost:27017"
    MONGO_DB = "finverse_interactions"
    
    # Create MongoDB client
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = client[MONGO_DB]
    
    # Store DB connection on app state
    app.state.mongo_client = client
    app.state.mongo_db = db
    
    logger.info("Connected to MongoDB")

async def close_db_connection(app: FastAPI):
    """
    Close database connections.
    
    Args:
        app: FastAPI application instance
    """
    app.state.mongo_client.close()
    logger.info("Closed MongoDB connection")

class DBService:
    """Service for interacting with the database"""
    
    def __init__(self, db):
        """
        Initialize the database service.
        
        Args:
            db: MongoDB database connection
        """
        self.db = db
    
    async def get_user_interactions(self, user_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Get interactions for a specific user.
        
        Args:
            user_id: User ID
            limit: Maximum number of interactions to return
            
        Returns:
            List of interaction documents
        """
        cursor = self.db.interactions.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(limit)
        
        return await cursor.to_list(length=limit)
    
    async def get_session_interactions(self, session_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """
        Get interactions for a specific session.
        
        Args:
            session_id: Session ID
            limit: Maximum number of interactions to return
            
        Returns:
            List of interaction documents
        """
        cursor = self.db.interactions.find(
            {"session_id": session_id}
        ).sort("timestamp", -1).limit(limit)
        
        return await cursor.to_list(length=limit)
    
    async def get_product_views(self, limit: int = 1000) -> List[Dict[str, Any]]:
        """
        Get product view events.
        
        Args:
            limit: Maximum number of events to return
            
        Returns:
            List of product view documents
        """
        cursor = self.db.interactions.find(
            {"type": "product_view"}
        ).sort("timestamp", -1).limit(limit)
        
        return await cursor.to_list(length=limit)
    
    async def get_all_users(self, limit: int = 1000) -> List[str]:
        """
        Get all unique user IDs.
        
        Args:
            limit: Maximum number of users to return
            
        Returns:
            List of unique user IDs
        """
        result = await self.db.interactions.distinct("user_id", {"user_id": {"$exists": True, "$ne": None}})
        return result[:limit] if len(result) > limit else result
    
    async def get_all_products(self, limit: int = 1000) -> List[str]:
        """
        Get all unique product IDs.
        
        Args:
            limit: Maximum number of products to return
            
        Returns:
            List of unique product IDs
        """
        # Get products from product view events
        result = await self.db.interactions.distinct(
            "data.productId", 
            {"type": "product_view", "data.productId": {"$exists": True, "$ne": None}}
        )
        return result[:limit] if len(result) > limit else result
    
    async def get_user_product_interactions(self, limit: int = 10000) -> List[Dict[str, Any]]:
        """
        Get all user-product interactions.
        
        Args:
            limit: Maximum number of interactions to return
            
        Returns:
            List of user-product interaction documents
        """
        pipeline = [
            {"$match": {
                "type": {"$in": ["product_view", "comparison", "interaction"]},
                "user_id": {"$exists": True, "$ne": None},
                "$or": [
                    {"data.productId": {"$exists": True, "$ne": None}},
                    {"data.productIDs": {"$exists": True, "$ne": []}}
                ]
            }},
            {"$sort": {"timestamp": -1}},
            {"$limit": limit}
        ]
        
        cursor = self.db.interactions.aggregate(pipeline)
        return await cursor.to_list(length=limit)
    
    async def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """
        Get preferences for a specific user.
        
        Args:
            user_id: User ID
            
        Returns:
            User preferences document
        """
        return await self.db.interactions.find_one(
            {"type": "preference", "user_id": user_id}
        )

def get_db_service(app: FastAPI) -> DBService:
    """
    Dependency injection for DBService.
    
    Args:
        app: FastAPI application instance
        
    Returns:
        Instance of DBService
    """
    return DBService(app.state.mongo_db)
