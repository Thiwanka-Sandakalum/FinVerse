# FinVerse Recommendation Service

A hybrid recommendation system for FinVerse's banking application, built using FastAPI and LightFM.

## Overview

The recommendation service is designed to generate personalized product recommendations for users of the FinVerse banking application, based on their interactions captured by the interaction tracking service.

The service implements a hybrid recommendation system using the LightFM library, combining:

1. **Collaborative filtering** - Recommends products based on user similarities and behaviors
2. **Content-based filtering** - Leverages product attributes and user preferences

## Features

- Personalized product recommendations for users
- Session-based recommendations for anonymous users
- Similar product recommendations
- Periodic model retraining for up-to-date recommendations
- RESTful API for integration with frontend applications

## Architecture

The service follows a modular architecture:

- **API Layer**: FastAPI endpoints for serving recommendations
- **Service Layer**: Core recommendation logic and integration with other services
- **Model Layer**: Hybrid recommendation model implementation using LightFM
- **Data Layer**: Data processing pipelines and database interactions

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose
- MongoDB (used by the interaction service)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/finverse.git
cd apps/backend/recommendation-service
```

2. Set up a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Service

#### Using Docker

```bash
docker-compose up -d
```

#### Locally

```bash
uvicorn src.main:app --host 0.0.0.0 --port 4003 --reload
```

### API Endpoints

The service exposes the following endpoints:

- `GET /health` - Health check endpoint
- `GET /api/v1/recommendations/products/{user_id}` - Get personalized product recommendations for a user
- `GET /api/v1/recommendations/session/{session_id}` - Get recommendations based on the current session
- `GET /api/v1/recommendations/similar-products/{product_id}` - Find similar products
- `POST /api/v1/recommendations/refresh-model` - Manually trigger a model refresh

## Usage

### Example: Get Recommendations for a User

```bash
curl -X GET "http://localhost:4003/api/v1/recommendations/products/user123?count=5"
```

### Example: Get Session-Based Recommendations

```bash
curl -X GET "http://localhost:4003/api/v1/recommendations/session/session456?count=5"
```

### Example: Get Similar Products

```bash
curl -X GET "http://localhost:4003/api/v1/recommendations/similar-products/product789?count=5"
```

## Model Training

The recommendation model is automatically refreshed at regular intervals (configurable via `MODEL_REFRESH_INTERVAL`). You can also trigger a manual refresh:

```bash
curl -X POST "http://localhost:4003/api/v1/recommendations/refresh-model"
```

## Integration with the Interaction Service

This service consumes data from the interaction tracking service. The interaction service tracks:

- Product views
- Comparison events
- Search queries
- General user interactions

This data is processed and used to train the recommendation model.

## License

[MIT License](LICENSE)
