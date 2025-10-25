"""
Custom exception classes for the recommendation service.
"""
from typing import Any, Dict, Optional


class RecommendationServiceError(Exception):
    """Base exception for recommendation service errors."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class ModelNotReadyError(RecommendationServiceError):
    """Raised when the recommendation model is not ready for predictions."""
    pass


class ModelTrainingError(RecommendationServiceError):
    """Raised when there's an error training the recommendation model."""
    pass


class DataPreparationError(RecommendationServiceError):
    """Raised when there's an error preparing training data."""
    pass


class DatabaseConnectionError(RecommendationServiceError):
    """Raised when there's an error connecting to the database."""
    pass


class ExternalServiceError(RecommendationServiceError):
    """Raised when there's an error calling external services."""
    pass


class UserNotFoundError(RecommendationServiceError):
    """Raised when a user is not found in the system."""
    pass


class ProductNotFoundError(RecommendationServiceError):
    """Raised when a product is not found in the system."""
    pass


class InvalidParameterError(RecommendationServiceError):
    """Raised when invalid parameters are provided."""
    pass


class FileOperationError(RecommendationServiceError):
    """Raised when there's an error with file operations (save/load)."""
    pass