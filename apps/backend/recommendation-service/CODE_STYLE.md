# Code Style Guide

## Overview

This document outlines the coding standards and best practices for the FinVerse Recommendation Service. Following these guidelines ensures consistency, maintainability, and readability across the codebase.

## Python Style

### General Principles

- **PEP 8 Compliance**: Follow PEP 8 style guide
- **Line Length**: Maximum 88 characters (Black formatter standard)
- **Imports**: Use absolute imports, organize with isort
- **Type Hints**: Always use type hints for function parameters and return values
- **Docstrings**: Use Google-style docstrings for all public functions and classes

### Code Formatting

We use automated tools for consistent formatting:

- **Black**: Code formatter (line length: 88)
- **isort**: Import sorting with Black profile
- **Ruff**: Fast Python linter and formatter

```bash
# Format code
black src/
isort src/
ruff check src/ --fix
```

### Naming Conventions

```python
# Constants (UPPER_SNAKE_CASE)
DEFAULT_TIMEOUT = 30
MAX_RECOMMENDATIONS = 50

# Variables and functions (snake_case)
user_id = "user-123"
recommendation_count = 5

def get_user_recommendations(user_id: str) -> List[ProductRecommendation]:
    pass

# Classes (PascalCase)
class RecommendationService:
    pass

# Private methods (leading underscore)
def _prepare_training_data(self) -> None:
    pass

# Protected methods (single underscore)
def _validate_input(self) -> bool:
    pass
```

### Type Hints

Always provide type hints for better code clarity and IDE support:

```python
from typing import Dict, List, Optional, Any

# Function with type hints
async def get_recommendations(
    user_id: str, 
    count: int = 5
) -> List[Dict[str, Any]]:
    """Get recommendations for a user."""
    pass

# Class with type hints
class UserInteraction:
    def __init__(self, user_id: str, timestamp: datetime) -> None:
        self.user_id = user_id
        self.timestamp = timestamp
```

### Docstrings

Use Google-style docstrings with proper formatting:

```python
async def get_user_recommendations(
    self, 
    user_id: str, 
    count: int = 5
) -> List[ProductRecommendation]:
    """
    Get personalized product recommendations for a user.
    
    Args:
        user_id: Unique identifier for the user
        count: Number of recommendations to return (default: 5)
        
    Returns:
        List of ProductRecommendation objects sorted by relevance
        
    Raises:
        UserNotFoundError: If the user doesn't exist in the system
        ModelNotReadyError: If the recommendation model isn't trained
        
    Example:
        ```python
        service = RecommendationService()
        recommendations = await service.get_user_recommendations("user-123", 10)
        ```
    """
    pass
```

## Architecture Patterns

### Clean Architecture

Follow clean architecture principles with clear separation of concerns:

```
src/
├── domain/           # Business logic and entities
│   ├── entities/     # Domain models
│   ├── repositories/ # Repository interfaces  
│   └── services/     # Domain services
├── application/      # Application layer
│   ├── dto/          # Data transfer objects
│   ├── services/     # Application services
│   └── use_cases/    # Use case implementations
├── infrastructure/   # External integrations
│   ├── database/     # Database implementations
│   ├── external/     # External service clients
│   └── models/       # ML model implementations
├── presentation/     # API layer
│   ├── api/          # FastAPI routes
│   └── schemas/      # API schemas
└── shared/           # Shared utilities
    ├── config/       # Configuration
    ├── constants/    # Constants
    ├── exceptions/   # Custom exceptions
    └── utils/        # Utility functions
```

### Dependency Injection

Use dependency injection for better testability and loose coupling:

```python
# Bad - tightly coupled
class RecommendationService:
    def __init__(self):
        self.db = MongoClient("mongodb://localhost:27017")
        
# Good - dependency injection
class RecommendationService:
    def __init__(self, repository: InteractionRepositoryInterface):
        self.repository = repository
```

### Error Handling

Use custom exceptions and proper error handling:

```python
# Custom exceptions
from shared.exceptions import UserNotFoundError, ModelNotReadyError

# Proper exception handling
async def get_recommendations(user_id: str) -> List[ProductRecommendation]:
    try:
        return await self._predict_for_user(user_id)
    except KeyError:
        raise UserNotFoundError(f"User {user_id} not found")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise ModelNotReadyError("Model prediction failed")
```

### Logging

Use structured logging with appropriate levels:

```python
import logging

logger = logging.getLogger(__name__)

# Log levels usage
logger.debug("Detailed debug information")
logger.info("General information") 
logger.warning("Warning about potential issues")
logger.error("Error occurred", exc_info=True)
logger.critical("Critical system failure")

# Structured logging with context
logger.info(
    "Model training completed",
    extra={
        "duration_seconds": 45.2,
        "num_users": 1250,
        "num_products": 340
    }
)
```

## Testing

### Test Structure

Organize tests to mirror the source code structure:

```
tests/
├── unit/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── integration/
├── fixtures/
└── conftest.py
```

### Test Naming

Use descriptive test names that explain the scenario:

```python
# Bad
def test_recommendations():
    pass

# Good  
def test_get_user_recommendations_returns_top_5_products_for_existing_user():
    pass

def test_get_user_recommendations_raises_error_when_user_not_found():
    pass
```

### Test Categories

- **Unit tests**: Test individual functions/classes in isolation
- **Integration tests**: Test component interactions
- **End-to-end tests**: Test complete workflows

## Performance Guidelines

### Async/Await

Use async/await for I/O operations:

```python
# Database operations
async def get_interactions(self) -> List[UserInteraction]:
    cursor = self.collection.find()
    return await cursor.to_list(length=None)

# HTTP requests
async def get_product_details(self, product_id: str) -> Dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"/products/{product_id}")
        return response.json()
```

### Memory Management

- Use generators for large datasets
- Implement proper cleanup in context managers
- Avoid loading entire datasets into memory

### Caching

Implement caching for frequently accessed data:

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_product_features(product_id: str) -> List[str]:
    """Cache product features to avoid repeated computation."""
    pass
```

## Security

### Input Validation

Always validate input parameters:

```python
from pydantic import BaseModel, Field, validator

class RecommendationRequest(BaseModel):
    user_id: str = Field(..., min_length=1, max_length=100)
    count: int = Field(5, ge=1, le=50)
    
    @validator('user_id')
    def validate_user_id(cls, v):
        if not v.isalnum():
            raise ValueError('User ID must be alphanumeric')
        return v
```

### Secrets Management

Never hardcode secrets in source code:

```python
# Bad
DATABASE_URL = "mongodb://user:password@localhost:27017"

# Good  
from shared.config import settings
DATABASE_URL = settings.database.mongodb_uri
```

## Documentation

### Code Comments

Write clear, concise comments for complex logic:

```python
# Calculate interaction weight based on type and duration
# Product applications get highest weight (3.0)
# View duration > 2 minutes gets 2x multiplier
weight = INTERACTION_WEIGHTS.get(interaction_type, 1.0)
if interaction_type == "product_view" and view_duration > 120:
    weight *= 2.0
```

### README Files

Each module should have a clear README explaining:
- Purpose and functionality
- Installation instructions
- Usage examples
- Configuration options
- API documentation

## Tools and IDE Setup

### Required Tools

```bash
# Install development dependencies
pip install black isort mypy ruff pytest pytest-cov

# Pre-commit hooks
pre-commit install
```

### VS Code Configuration

Use the provided `.vscode/settings.json` for consistent IDE behavior.

### Git Hooks

Set up pre-commit hooks to ensure code quality:

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.0.270
    hooks:
      - id: ruff
```

This style guide ensures consistent, maintainable, and professional code across the FinVerse Recommendation Service.