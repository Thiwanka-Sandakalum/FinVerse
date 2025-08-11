"""
Configuration management for the recommendation service.
"""
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

class Config(BaseSettings):
    """Configuration settings for the recommendation service."""
    
    # Service configuration
    HOST: str = "0.0.0.0"
    PORT: int = 4003
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 4003
    ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    SERVICE_NAME: str = "recommendation-service"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    
    # CORS configuration
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # MongoDB configuration
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "finverse_interactions"
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB: str = "finverse_interactions"
    
    # Model paths
    MODEL_PATH: str = "data/recommendation_model.pkl"
    USER_FEATURES_PATH: str = "data/user_features.npz"
    ITEM_FEATURES_PATH: str = "data/item_features.npz"
    USER_MAPPING_PATH: str = "data/user_mapping.pkl"
    ITEM_MAPPING_PATH: str = "data/item_mapping.pkl"
    FEATURE_MAPPING_PATH: str = "data/feature_mapping.pkl"
    
    # Redis configuration
    REDIS_URL: str = "redis://redis:6379/0"
    REDIS_PRODUCT_PREFIX: str = "product:"
    REDIS_PRODUCT_TTL: int = 3600  # 1 hour
    
    # Banking service configuration
    BANKING_SERVICE_URL: str = "http://banking-service:4001"
    
    # RabbitMQ configuration
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672/"
    
    # Model configuration
    MODEL_REFRESH_INTERVAL: int = 3600  # 1 hour
    NUM_COMPONENTS: int = 50
    LEARNING_RATE: float = 0.05
    LOSS: str = "warp"
    EPOCHS: int = 20
    USER_ALPHA: float = 1e-5
    ITEM_ALPHA: float = 1e-5
    
    # Path configuration
    ROOT_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATA_DIR: Path = ROOT_DIR / "data"
    
    # Banking service configuration
    BANKING_SERVICE_DB: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from environment variables

settings = Config()
