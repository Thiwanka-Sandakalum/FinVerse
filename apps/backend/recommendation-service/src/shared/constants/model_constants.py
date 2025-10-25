"""
Model constants for the recommendation service.
"""
from typing import Final

# Model hyperparameters
DEFAULT_NUM_COMPONENTS: Final[int] = 50
DEFAULT_LEARNING_RATE: Final[float] = 0.05
DEFAULT_LOSS: Final[str] = 'warp'  # Weighted Approximate-Rank Pairwise
DEFAULT_EPOCHS: Final[int] = 20
DEFAULT_USER_ALPHA: Final[float] = 1e-5
DEFAULT_ITEM_ALPHA: Final[float] = 1e-5
DEFAULT_MAX_SAMPLED: Final[int] = 30

# Interaction weights
INTERACTION_WEIGHTS: Final[dict[str, float]] = {
    "product_view": 1.0,
    "product_application": 3.0,
    "product_inquiry": 1.5,
    "product_bookmark": 2.0,
    "comparison": 0.8,
    "click": 0.5,
    "favorite": 1.5,
    "save": 1.5,
    "apply": 2.0,
    "purchase": 2.0,
}

# View duration thresholds (in seconds)
VIEW_DURATION_THRESHOLDS: Final[dict[str, float]] = {
    "short": 60,   # 1 minute
    "medium": 120, # 2 minutes
}

# View duration multipliers
VIEW_DURATION_MULTIPLIERS: Final[dict[str, float]] = {
    "short": 1.5,
    "medium": 2.0,
}

# File names
MODEL_FILENAME: Final[str] = "recommendation_model.pkl"
USER_FEATURES_FILENAME: Final[str] = "user_features.npz"
ITEM_FEATURES_FILENAME: Final[str] = "item_features.npz"
USER_MAPPING_FILENAME: Final[str] = "user_mapping.pkl"
ITEM_MAPPING_FILENAME: Final[str] = "item_mapping.pkl"
FEATURE_MAPPING_FILENAME: Final[str] = "feature_mapping.pkl"

# Default values
DEFAULT_RELEVANCE_SCORE: Final[float] = 0.5
DEFAULT_RECOMMENDATIONS_COUNT: Final[int] = 5
MAX_INTERACTION_LIMIT: Final[int] = 50000
MAX_SESSION_PRODUCTS_FOR_RECOMMENDATIONS: Final[int] = 3