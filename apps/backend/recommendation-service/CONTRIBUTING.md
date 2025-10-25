# Contributing to FinVerse Recommendation Service

Thank you for your interest in contributing to the FinVerse Recommendation Service! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup) 
- [Contribution Workflow](#contribution-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Getting Started

### Prerequisites

- Python 3.11+
- MongoDB (for local development)
- Git
- Docker (optional, for containerized development)

### Project Overview

The FinVerse Recommendation Service is a microservice that provides personalized product recommendations using machine learning techniques. It's built with:

- **FastAPI**: Web framework
- **LightFM**: Recommendation model
- **MongoDB**: Data storage
- **Pydantic**: Data validation
- **Clean Architecture**: Separation of concerns

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd recommendation-service
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
# Install production dependencies
pip install -r requirements.txt

# Install development dependencies  
pip install -r requirements-dev.txt
```

### 4. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 5. Database Setup

```bash
# Start MongoDB (if using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
```

### 6. Run Tests

```bash
pytest tests/
```

### 7. Start Development Server

```bash
python -m src.main
```

The API will be available at `http://localhost:4003`

## Contribution Workflow

### 1. Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally
3. Add the original repository as upstream:

```bash
git remote add upstream <original-repository-url>
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-user-segmentation`
- `fix/model-training-memory-leak`
- `docs/update-api-documentation`

### 3. Make Changes

Follow the [Code Style Guide](CODE_STYLE.md) and ensure:

- Code is well-documented
- Tests are included
- Type hints are used
- Code passes all checks

### 4. Run Quality Checks

```bash
# Format code
black src/
isort src/

# Lint code
ruff check src/

# Type checking
mypy src/

# Run tests
pytest tests/ --cov=src/
```

### 5. Commit Changes

Use conventional commit format:

```bash
git commit -m "feat: add user segmentation to recommendation model"
git commit -m "fix: resolve memory leak in model training"
git commit -m "docs: update API endpoint documentation"
```

Commit message format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

## Code Standards

### Quality Requirements

All contributions must meet these standards:

- **Type Safety**: Use type hints for all function parameters and returns
- **Documentation**: Include docstrings for all public functions and classes
- **Testing**: Maintain or improve test coverage (minimum 80%)
- **Linting**: Pass all linting checks (ruff, mypy)
- **Formatting**: Code must be formatted with Black

### Architecture Guidelines

Follow clean architecture principles:

- **Domain Layer**: Business logic, entities, repository interfaces
- **Application Layer**: Use cases, DTOs, application services  
- **Infrastructure Layer**: Database, external services, model implementations
- **Presentation Layer**: API routes, schemas, middleware

### Error Handling

- Use custom exceptions from `shared.exceptions`
- Include proper logging with appropriate levels
- Provide meaningful error messages
- Handle edge cases gracefully

## Testing Guidelines

### Test Categories

1. **Unit Tests** (`tests/unit/`)
   - Test individual functions/classes in isolation
   - Mock external dependencies
   - Fast execution (<1s per test)

2. **Integration Tests** (`tests/integration/`)
   - Test component interactions
   - Use test database
   - Moderate execution time

3. **End-to-End Tests** (`tests/e2e/`)
   - Test complete workflows
   - Full system integration
   - Slower execution

### Test Requirements

- **Coverage**: Minimum 80% code coverage
- **Naming**: Descriptive test names explaining the scenario
- **Isolation**: Tests should not depend on each other
- **Data**: Use fixtures for test data setup

### Writing Tests

```python
import pytest
from unittest.mock import AsyncMock, Mock

from src.domain.services.recommendation_domain_service import RecommendationDomainService
from src.shared.exceptions.exceptions import UserNotFoundError


class TestRecommendationDomainService:
    """Test suite for RecommendationDomainService."""
    
    @pytest.fixture
    def mock_repositories(self):
        """Create mock repositories for testing."""
        interaction_repo = AsyncMock()
        product_repo = AsyncMock()
        model = Mock()
        return interaction_repo, product_repo, model
    
    @pytest.fixture  
    def service(self, mock_repositories):
        """Create service instance with mocked dependencies."""
        interaction_repo, product_repo, model = mock_repositories
        return RecommendationDomainService(model, interaction_repo, product_repo)
    
    async def test_get_user_recommendations_returns_recommendations_for_existing_user(
        self, service, mock_repositories
    ):
        """Test that valid user gets personalized recommendations."""
        # Arrange
        user_id = "user-123"
        expected_recommendations = [Mock(), Mock()]
        _, _, model = mock_repositories
        model.is_ready.return_value = True
        model.predict_for_user.return_value = expected_recommendations
        
        # Act
        result = await service.get_user_recommendations(user_id, count=5)
        
        # Assert
        assert len(result) == 2
        model.predict_for_user.assert_called_once_with(user_id, 5)
    
    async def test_get_user_recommendations_raises_error_when_user_not_found(
        self, service, mock_repositories
    ):
        """Test that missing user raises UserNotFoundError."""
        # Arrange
        user_id = "nonexistent-user"
        _, _, model = mock_repositories
        model.is_ready.return_value = True
        model.predict_for_user.side_effect = UserNotFoundError("User not found")
        
        # Act & Assert
        with pytest.raises(UserNotFoundError):
            await service.get_user_recommendations(user_id, count=5)
```

## Documentation

### Code Documentation

- **Docstrings**: All public functions and classes must have docstrings
- **Type Hints**: Use type hints for better IDE support
- **Comments**: Explain complex business logic
- **Examples**: Include usage examples in docstrings

### API Documentation

- API documentation is auto-generated from FastAPI
- Ensure response models are properly defined
- Add meaningful descriptions to endpoints
- Include example requests/responses

### Architecture Documentation

Update architecture documentation when making structural changes:

- System diagrams
- Component interactions  
- Data flow diagrams
- Deployment architecture

## Pull Request Process

### Before Submitting

Ensure your PR meets these requirements:

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Test coverage maintained/improved
- [ ] Documentation updated
- [ ] No lint errors
- [ ] Type checking passes

### PR Description Template

```markdown
## Description
Brief description of changes and motivation.

## Changes Made
- [ ] Feature A implemented
- [ ] Bug B fixed  
- [ ] Documentation updated

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Breaking Changes
List any breaking changes and migration steps.

## Additional Notes
Any additional context or considerations.
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one approval from maintainer
3. **Manual Testing**: Reviewer may test functionality
4. **Merge**: Squash and merge after approval

## Issue Reporting

### Bug Reports

Use the bug report template and include:

- **Environment**: Python version, OS, dependencies
- **Steps to Reproduce**: Clear reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Logs/Screenshots**: Relevant error messages

### Feature Requests

Use the feature request template and include:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered
- **Use Cases**: Real-world usage scenarios

### Question/Discussion

For questions or discussions:
- Check existing issues and documentation first
- Use descriptive titles
- Provide context and background
- Tag with appropriate labels

## Development Tips

### Debugging

```bash
# Run with debug logging
LOG_LEVEL=DEBUG python -m src.main

# Run specific test with verbose output  
pytest tests/unit/test_recommendation_service.py -v -s

# Profile performance
python -m cProfile -o profile.stats -m src.main
```

### Database Management

```bash
# Reset database (development only)
python -m src.scripts.reset_database

# Seed test data
python -m src.scripts.seed_data
```

### Model Development

```bash
# Train model with sample data
python -m src.scripts.train_model

# Evaluate model performance
python -m src.scripts.evaluate_model
```

## Getting Help

- **Documentation**: Check the README and code documentation
- **Issues**: Search existing issues for similar problems
- **Discussions**: Use GitHub discussions for questions
- **Community**: Join our community channels

## Recognition

Contributors who make significant improvements will be:
- Added to the contributors list
- Mentioned in release notes
- Invited to join the core team (for ongoing contributors)

Thank you for contributing to FinVerse! 🚀