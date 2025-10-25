# 🎯 FinVerse Recommendation Service

A high-performance, production-ready recommendation service that provides personalized product recommendations using advanced machine learning techniques. Built with clean architecture principles and modern Python practices.

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)

## ✨ Features

- **🔥 Hybrid Recommendations**: Collaborative + Content-based filtering using LightFM
- **👤 Multi-Mode Support**: User-based, session-based, and product similarity recommendations  
- **⚡ Real-time Training**: Automatic model updates with latest interaction data
- **🏗️ Clean Architecture**: Separation of concerns with domain-driven design
- **🛡️ Production Ready**: Comprehensive error handling, logging, and monitoring
- **📊 Type Safe**: Full type annotations and mypy compliance
- **🧪 Well Tested**: High test coverage with unit, integration, and E2E tests
- **📡 RESTful API**: Fast, documented API with automatic OpenAPI generation

## 🏛️ Architecture

The service follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── 🏪 domain/              # Core business logic (entities, rules)
│   ├── entities/           # Domain models and value objects
│   ├── repositories/       # Repository interfaces
│   └── services/           # Domain business logic
├── 🎯 application/         # Application orchestration layer  
│   ├── dto/               # Data transfer objects
│   ├── services/          # Application services
│   └── use_cases/         # Use case implementations
├── 🔧 infrastructure/      # External world interactions
│   ├── database/          # Database implementations
│   ├── external/          # External service clients
│   ├── models/            # ML model implementations  
│   └── persistence/       # Repository implementations
├── 🌐 presentation/        # User interface layer
│   └── api/               # FastAPI routes and schemas
└── 🛠️ shared/             # Cross-cutting concerns
    ├── config/            # Configuration management
    ├── constants/         # Application constants
    ├── exceptions/        # Custom exceptions
    └── utils/             # Utility functions
```

### 🧩 Key Components

- **Domain Entities**: `UserInteraction`, `ProductRecommendation`, `ModelRefreshResult`
- **Repository Pattern**: Clean data access abstraction
- **Dependency Injection**: Loose coupling and testability
- **Event-Driven**: Background model refresh scheduler
- **Error Boundaries**: Comprehensive exception handling

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** 
- **MongoDB 4.4+**
- **Git**

### 1️⃣ Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd recommendation-service

# Create virtual environment  
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2️⃣ Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
vim .env
```

**Key Environment Variables:**
```bash
# Service
SERVICE_HOST=0.0.0.0
SERVICE_PORT=4003
SERVICE_DEBUG=false

# Database  
DB_MONGODB_URI=mongodb://localhost:27017
DB_MONGODB_DATABASE=finverse_interactions

# External Services
EXTERNAL_BANKING_SERVICE_URL=http://banking-service:4001

# Model Settings
MODEL_NUM_COMPONENTS=50
MODEL_REFRESH_INTERVAL_SECONDS=3600
```

### 3️⃣ Start Dependencies

```bash
# MongoDB with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB
mongod --dbpath /path/to/data
```

### 4️⃣ Run Service

```bash
# Development mode
python -m src.main

# Production mode  
SERVICE_DEBUG=false python -m src.main
```

🎉 **Service running at:** `http://localhost:4003`

📚 **API Documentation:** `http://localhost:4003/docs`

## 🛠️ API Reference

### 🏥 Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Basic health check |
| `GET` | `/health/detailed` | Detailed component status |

### 🎯 Recommendation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/recommendations/users/{user_id}/products` | User recommendations |
| `GET` | `/api/v1/recommendations/sessions/{session_id}/products` | Session recommendations |
| `GET` | `/api/v1/recommendations/products/{product_id}/similar` | Similar products |
| `POST` | `/api/v1/recommendations/refresh-model` | Trigger model refresh |

### 📝 Example Request/Response

**Request:**
```bash
GET /api/v1/recommendations/users/user-123/products?count=5
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "savings-premium-001",
      "name": "Premium Savings Account",
      "relevanceScore": 0.94,
      "rank": 1,
      "category": "Savings",
      "institution": "FinVerse Bank",
      "interestRate": "4.2%",
      "minimumBalance": 1000
    }
  ],
  "user_id": "user-123", 
  "count": 1
}
```

## 🧪 Development

### Code Quality Tools

```bash
# Format code
black src/ tests/
isort src/ tests/

# Lint and fix
ruff check src/ --fix
ruff format src/

# Type checking
mypy src/

# Run tests with coverage
pytest tests/ --cov=src/ --cov-report=html
```

### 🧪 Testing Strategy

```bash
# All tests
pytest

# Unit tests only
pytest tests/unit/ -v

# Integration tests
pytest tests/integration/ -v

# E2E tests
pytest tests/e2e/ -v

# Coverage report
pytest --cov=src/ --cov-report=term-missing
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) and [Code Style Guide](CODE_STYLE.md).

**Quick Contribution Steps:**

1. 🍴 Fork the repository
2. 🌿 Create feature branch: `git checkout -b feature/amazing-feature`  
3. 📝 Make changes following our style guide
4. ✅ Add tests and ensure they pass
5. 📤 Submit pull request with clear description

### Development Setup

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install

# Run quality checks
make lint test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the FinVerse Team**

[📖 Documentation](docs/) • [🐛 Report Bug](../../issues) • [💡 Request Feature](../../issues) • [💬 Discussions](../../discussions)

</div>
