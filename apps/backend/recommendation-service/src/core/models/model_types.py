"""
Type definitions for recommendation models.
"""
from typing import TypedDict

class ModelRefreshResult(TypedDict, total=False):
    """Type definition for model refresh result"""
    success: bool
    duration_seconds: float
    timestamp: str
    num_users: int
    num_products: int
    error: str
