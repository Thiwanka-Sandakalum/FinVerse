"""
Centralized configuration management for the recommendation service.
"""
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class DatabaseSettings(BaseSettings):
    """Database configuration settings."""
    
    mongodb_uri: str = Field(
        default="mongodb://localhost:27017",
        description="MongoDB connection URI"
    )
    mongodb_database: str = Field(
        default="finverse_interactions",
        description="MongoDB database name"
    )
    
    model_config = {"env_prefix": "DB_", "env_file": ".env", "case_sensitive": False, "extra": "ignore"}


class ServiceSettings(BaseSettings):
    """Service configuration settings."""
    
    name: str = Field(default="recommendation-service")
    version: str = Field(default="1.0.0")
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=4003)
    debug: bool = Field(default=False)
    log_level: str = Field(default="INFO")
    
    model_config = {"env_prefix": "SERVICE_", "env_file": ".env", "case_sensitive": False, "extra": "ignore"}


class CorsSettings(BaseSettings):
    """CORS configuration settings."""
    
    allow_origins: List[str] = Field(default=["*"])
    allow_credentials: bool = Field(default=True)
    allow_methods: List[str] = Field(default=["*"])
    allow_headers: List[str] = Field(default=["*"])
    
    
    model_config = {"env_prefix": "CORS_", "extra": "ignore"}


class ExternalServiceSettings(BaseSettings):
    """External service configuration."""
    
    banking_service_url: str = Field(
        default="http://banking-service:4001",
        description="Banking service base URL"
    )
    banking_service_timeout: int = Field(
        default=30,
        description="Banking service request timeout in seconds"
    )
    
    
    model_config = {"env_prefix": "EXTERNAL_", "extra": "ignore"}


class ModelSettings(BaseSettings):
    """Machine learning model configuration."""
    
    # Model hyperparameters
    num_components: int = Field(default=50, description="Number of latent factors")
    learning_rate: float = Field(default=0.05, description="Learning rate")
    loss: str = Field(default="warp", description="Loss function")
    epochs: int = Field(default=20, description="Training epochs")
    user_alpha: float = Field(default=1e-5, description="User regularization")
    item_alpha: float = Field(default=1e-5, description="Item regularization")
    max_sampled: int = Field(default=30, description="Max negative samples")
    
    # Model refresh settings
    refresh_interval_seconds: int = Field(
        default=3600, 
        description="Model refresh interval in seconds"
    )
    
    
    model_config = {"env_prefix": "MODEL_", "extra": "ignore"}


class StorageSettings(BaseSettings):
    """Storage configuration settings."""
    
    data_dir: Path = Field(
        default_factory=lambda: Path(__file__).parent.parent.parent.parent / "data",
        description="Data directory for model files"
    )
    
    # Model file names
    model_filename: str = Field(default="recommendation_model.pkl")
    user_features_filename: str = Field(default="user_features.npz")
    item_features_filename: str = Field(default="item_features.npz")
    user_mapping_filename: str = Field(default="user_mapping.pkl")
    item_mapping_filename: str = Field(default="item_mapping.pkl")
    feature_mapping_filename: str = Field(default="feature_mapping.pkl")
    
    
    model_config = {"env_prefix": "STORAGE_", "protected_namespaces": ("settings_",), "extra": "ignore"}
    
    def __post_init__(self):
        """Ensure data directory exists."""
        self.data_dir.mkdir(parents=True, exist_ok=True)


class QueueSettings(BaseSettings):
    """Message queue configuration."""
    
    rabbitmq_url: str = Field(
        default="amqp://guest:guest@localhost:5672/",
        description="RabbitMQ connection URL"
    )
    
    class Config:
        env_prefix = "QUEUE_"


class AppSettings(BaseSettings):
    """Main application settings."""
    
    # Nested settings
    service: ServiceSettings = Field(default_factory=ServiceSettings)
    database: DatabaseSettings = Field(default_factory=DatabaseSettings)
    cors: CorsSettings = Field(default_factory=CorsSettings)
    external: ExternalServiceSettings = Field(default_factory=ExternalServiceSettings)
    model: ModelSettings = Field(default_factory=ModelSettings)
    storage: StorageSettings = Field(default_factory=StorageSettings)
    queue: QueueSettings = Field(default_factory=QueueSettings)
    
    # Global settings
    environment: str = Field(default="development", description="Environment name")
    api_prefix: str = Field(default="/api/v1", description="API prefix")
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment.lower() in ("development", "dev", "local")
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment.lower() in ("production", "prod")


# Global settings instance
settings = AppSettings()