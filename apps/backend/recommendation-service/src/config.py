"""
Configuration settings for the recommendation service.
"""
import os
from pydantic import BaseSettings
from typing import Dict, Any, List, Optional

class Settings(BaseSettings):
    """Application settings"""
    
    # Service settings
    SERVICE_NAME: str = "recommendation-service"
    VERSION: str = "1.0.0"
    DEBUG: bool = bool(os.getenv("DEBUG", False))
    
    # API settings
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", 4003))
    API_PREFIX: str = "/api/v1"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    
    # MongoDB settings
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB: str = os.getenv("MONGO_DB", "finverse_interactions")
    
    # Model settings
    MODEL_PATH: str = os.getenv("MODEL_PATH", "../data/recommendation_model.pkl")
    USER_FEATURES_PATH: str = os.getenv("USER_FEATURES_PATH", "../data/user_features.npz")
    ITEM_FEATURES_PATH: str = os.getenv("ITEM_FEATURES_PATH", "../data/item_features.npz")
    USER_MAPPING_PATH: str = os.getenv("USER_MAPPING_PATH", "../data/user_mapping.pkl")
    ITEM_MAPPING_PATH: str = os.getenv("ITEM_MAPPING_PATH", "../data/item_mapping.pkl")
    FEATURE_MAPPING_PATH: str = os.getenv("FEATURE_MAPPING_PATH", "../data/feature_mapping.pkl")
    
    # LightFM model hyperparameters
    NUM_COMPONENTS: int = int(os.getenv("NUM_COMPONENTS", 30))
    LEARNING_RATE: float = float(os.getenv("LEARNING_RATE", 0.05))
    LOSS: str = os.getenv("LOSS", "warp")
    EPOCHS: int = int(os.getenv("EPOCHS", 20))
    USER_ALPHA: float = float(os.getenv("USER_ALPHA", 1e-6))
    ITEM_ALPHA: float = float(os.getenv("ITEM_ALPHA", 1e-6))
    
    # Banking service API (for fetching product details)
    BANKING_SERVICE_URL: str = os.getenv("BANKING_SERVICE_URL", "http://localhost:4001/api/v1")
    
    # Scheduler settings
    MODEL_REFRESH_INTERVAL: int = int(os.getenv("MODEL_REFRESH_INTERVAL", 86400))  # 24 hours
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        
settings = Settings()
