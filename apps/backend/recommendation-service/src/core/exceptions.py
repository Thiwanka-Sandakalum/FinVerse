"""
Custom exceptions for the recommendation service.
"""

class RecommendationServiceError(Exception):
    """Base exception for recommendation service."""
    pass

class ModelNotReadyError(RecommendationServiceError):
    """Raised when the recommendation model is not ready."""
    pass

class DatabaseError(RecommendationServiceError):
    """Raised when there is a database error."""
    pass

class BankingServiceError(RecommendationServiceError):
    """Raised when there is an error with the banking service."""
    pass

class CacheError(RecommendationServiceError):
    """Raised when there is an error with the cache."""
    pass
