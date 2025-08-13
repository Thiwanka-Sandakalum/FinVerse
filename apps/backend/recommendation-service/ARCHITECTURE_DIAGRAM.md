# FinVerse Recommendation Service - Architecture Diagram

## System Overview

The FinVerse Recommendation Service is a sophisticated machine learning microservice that provides personalized product recommendations for users of the FinVerse banking application. It implements a hybrid recommendation system combining collaborative filtering and content-based filtering using the LightFM library.

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FinVerse Ecosystem                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌─────────────┐    ┌──────────────┐                   │
│  │              │    │             │    │              │                   │
│  │   Frontend   │    │  Interaction│    │   Banking    │                   │
│  │ Application  │◄──►│   Service   │◄──►│   Service    │                   │
│  │              │    │             │    │              │                   │
│  └──────────────┘    └─────────────┘    └──────────────┘                   │
│                             │                     │                        │
│                             │                     │                        │
│                             ▼                     ▼                        │
│  ┌─────────────────────────────────────────────────────────────────────────┤
│  │                                                                         │
│  │                 RECOMMENDATION SERVICE                                  │
│  │                                                                         │
│  │  ┌─────────────┐                        ┌─────────────┐                │
│  │  │             │                        │             │                │
│  │  │ RabbitMQ    │                        │   Banking   │                │
│  │  │ Queue       │──────────────────────► │   Service   │                │
│  │  │ Consumer    │                        │   Client    │                │
│  │  │             │                        │             │                │
│  │  └─────────────┘                        └─────────────┘                │
│  │         │                                       │                       │
│  │         ▼                                       │                       │
│  │  ┌─────────────────────────────────────────────────────────────────────┤
│  │  │                    CORE ENGINE                                      │
│  │  │                                                                     │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │  │  │                │  │                │  │                │        │
│  │  │  │      API       │  │   Recommendation │  │ Model Refresh  │        │
│  │  │  │    Layer       │◄─┤     Service     ├──┤   Scheduler    │        │
│  │  │  │   (FastAPI)    │  │                │  │                │        │
│  │  │  │                │  │                │  │                │        │
│  │  │  └────────────────┘  └────────────────┘  └────────────────┘        │
│  │  │                               │                                     │
│  │  │                               ▼                                     │
│  │  │  ┌─────────────────────────────────────────────────────┐           │
│  │  │  │                MODEL LAYER                          │           │
│  │  │  │                                                     │           │
│  │  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │           │
│  │  │  │  │             │  │             │  │             │  │           │
│  │  │  │  │   Hybrid    │  │    Data     │  │   Feature   │  │           │
│  │  │  │  │Recommendation│◄─┤  Pipeline  │◄─┤  Engineering│  │           │
│  │  │  │  │ Model       │  │             │  │             │  │           │
│  │  │  │  │  (LightFM)  │  │             │  │             │  │           │
│  │  │  │  └─────────────┘  └─────────────┘  └─────────────┘  │           │
│  │  │  └─────────────────────────────────────────────────────┘           │
│  │  │                               │                                     │
│  │  │                               ▼                                     │
│  │  │  ┌─────────────────────────────────────────────────────┐           │
│  │  │  │                 DATA LAYER                          │           │
│  │  │  │                                                     │           │
│  │  │  │  ┌─────────────┐              ┌─────────────┐       │           │
│  │  │  │  │             │              │             │       │           │
│  │  │  │  │ DB Service  │◄────────────►│  MongoDB    │       │           │
│  │  │  │  │             │              │ (Interactions)│     │           │
│  │  │  │  │             │              │             │       │           │
│  │  │  │  └─────────────┘              └─────────────┘       │           │
│  │  │  └─────────────────────────────────────────────────────┘           │
│  │  └─────────────────────────────────────────────────────────────────────┤
│  └─────────────────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────────────┘

          ┌─────────────┐                    ┌─────────────┐
          │             │                    │             │
          │  RabbitMQ   │                    │  File       │
          │  Message    │                    │  Storage    │
          │  Queue      │                    │  (Models)   │
          │             │                    │             │
          └─────────────┘                    └─────────────┘
```

## Detailed Component Architecture

### 1. API Layer (FastAPI)

```
┌─────────────────────────────────────────────────────┐
│                    API Layer                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐    ┌──────────────────┐      │
│  │                  │    │                  │      │
│  │  Health Router   │    │ Recommendations  │      │
│  │                  │    │     Router       │      │
│  │  GET /health     │    │                  │      │
│  │                  │    │ Endpoints:       │      │
│  │                  │    │ • /products/{id} │      │
│  │                  │    │ • /session/{id}  │      │
│  │                  │    │ • /similar/{id}  │      │
│  │                  │    │ • /refresh-model │      │
│  │                  │    │                  │      │
│  └──────────────────┘    └──────────────────┘      │
│                                                     │
│  ┌─────────────────────────────────────────────────┤
│  │             Middleware Layer                    │
│  │                                                 │
│  │  • CORS Middleware                              │
│  │  • Exception Handlers                          │
│  │  • Dependency Injection                        │
│  │                                                 │
│  └─────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────┘
```

**Key Features:**
- RESTful API endpoints for recommendations
- FastAPI framework with automatic OpenAPI documentation
- CORS support for cross-origin requests
- Global exception handling
- Request/response validation with Pydantic models

### 2. Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐                                      │
│  │ RecommendationService │                                      │
│  │                      │                                      │
│  │ Core Functions:      │                                      │
│  │ • get_recommendations_for_user()                            │
│  │ • get_recommendations_for_session()                         │
│  │ • get_similar_products()                                    │
│  │ • refresh_model()                                           │
│  │ • _get_most_popular_products()                              │
│  │                      │                                      │
│  └────────┬─────────────┘                                      │
│           │                                                    │
│           ▼                                                    │
│  ┌─────────────────────────────────────────────────┐          │
│  │              Supporting Services                 │          │
│  │                                                 │          │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  │             │  │             │  │             │        │
│  │  │ DB Service  │  │ Banking     │  │ Model       │        │
│  │  │             │  │ Service     │  │ Refresh     │        │
│  │  │ • MongoDB   │  │ Client      │  │ Scheduler   │        │
│  │  │   queries   │  │             │  │             │        │
│  │  │ • Data      │  │ • Product   │  │ • Periodic  │        │
│  │  │   retrieval │  │   details   │  │   refresh   │        │
│  │  │ • User      │  │ • Batch     │  │ • Background│        │
│  │  │   interactions │ │   API     │  │   tasks     │        │
│  │  │             │  │   calls     │  │             │        │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │
│  │                                                           │
│  └─────────────────────────────────────────────────┐        │
│                                                     │        │
│  ┌─────────────────────────────────────────────────┘        │
│  │              Queue Consumer                              │
│  │                                                         │
│  │  • RabbitMQ message consumption                         │
│  │  • Real-time interaction data ingestion                 │
│  │  • Message processing and MongoDB storage               │
│  │                                                         │
│  └─────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────┘
```

### 3. Machine Learning Model Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                    ML Model Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │            Hybrid Recommendation Model           │           │
│  │                  (LightFM)                      │           │
│  │                                                 │           │
│  │  Architecture:                                  │           │
│  │  ┌─────────────────────────────────────────────┐│           │
│  │  │        Collaborative Filtering              ││           │
│  │  │                                             ││           │
│  │  │  • User-Item Interaction Matrix             ││           │
│  │  │  • Matrix Factorization                     ││           │
│  │  │  • User-User & Item-Item Similarities       ││           │
│  │  │                                             ││           │
│  │  └─────────────────────────────────────────────┘│           │
│  │                      +                          │           │
│  │  ┌─────────────────────────────────────────────┐│           │
│  │  │         Content-Based Filtering             ││           │
│  │  │                                             ││           │
│  │  │  • User Feature Vectors                     ││           │
│  │  │    - Demographics (age, income)             ││           │
│  │  │    - Behavioral patterns                    ││           │
│  │  │    - Interaction history                    ││           │
│  │  │                                             ││           │
│  │  │  • Item Feature Vectors                     ││           │
│  │  │    - Product category                       ││           │
│  │  │    - Institution                            ││           │
│  │  │    - Product characteristics                ││           │
│  │  │                                             ││           │
│  │  └─────────────────────────────────────────────┘│           │
│  │                                                 │           │
│  │  Model Parameters:                              │           │
│  │  • Components: 50                               │           │
│  │  • Learning Rate: 0.05                         │           │
│  │  • Loss Function: WARP                         │           │
│  │  • Epochs: 20                                  │           │
│  │  • Regularization: L2 (user: 1e-5, item: 1e-5)│           │
│  │                                                 │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │                Data Pipeline                     │           │
│  │                                                 │           │
│  │  Data Processing Flow:                          │           │
│  │  1. Raw Interaction Data                        │           │
│  │  2. Data Cleaning & Validation                  │           │
│  │  3. Feature Engineering                         │           │
│  │  4. User-Item Matrix Construction               │           │
│  │  5. Feature Matrix Creation                     │           │
│  │  6. Model Training Data Preparation             │           │
│  │                                                 │           │
│  │  Feature Engineering:                           │           │
│  │  • Interaction weights (view duration, type)    │           │
│  │  • User demographics encoding                   │           │
│  │  • Product category encoding                    │           │
│  │  • Temporal features                            │           │
│  │                                                 │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

**Model Capabilities:**
- **Cold Start Handling**: New users get popular products, new products use content similarity
- **Real-time Inference**: Fast prediction using pre-computed embeddings
- **Batch Processing**: Efficient training on historical interaction data
- **Scalable Architecture**: Model can handle growing user/product catalogs

### 4. Data Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │              MongoDB Database                    │           │
│  │            (finverse_interactions)              │           │
│  │                                                 │           │
│  │  Collections:                                   │           │
│  │  ┌─────────────────────────────────────────────┐│           │
│  │  │           interactions                      ││           │
│  │  │                                             ││           │
│  │  │  Document Structure:                        ││           │
│  │  │  {                                          ││           │
│  │  │    "_id": ObjectId,                         ││           │
│  │  │    "user_id": "string",                     ││           │
│  │  │    "session_id": "string",                  ││           │
│  │  │    "type": "product_view|comparison|...",   ││           │
│  │  │    "timestamp": ISODate,                    ││           │
│  │  │    "data": {                                ││           │
│  │  │      "productId": "string",                 ││           │
│  │  │      "productIDs": ["array"],               ││           │
│  │  │      "category": "string",                  ││           │
│  │  │      "institution": "string",               ││           │
│  │  │      "viewDuration": number,                ││           │
│  │  │      "userDemographics": {                  ││           │
│  │  │        "age_group": "string",               ││           │
│  │  │        "income_range": "string",            ││           │
│  │  │        "location": "string"                 ││           │
│  │  │      }                                      ││           │
│  │  │    },                                       ││           │
│  │  │    "received_at": ISODate,                  ││           │
│  │  │    "queue_source": "string",                ││           │
│  │  │    "processed_by": "recommendation-service" ││           │
│  │  │  }                                          ││           │
│  │  │                                             ││           │
│  │  │  Indexes:                                   ││           │
│  │  │  • user_id                                  ││           │
│  │  │  • session_id                               ││           │
│  │  │  • timestamp                                ││           │
│  │  │  • type                                     ││           │
│  │  │  • data.productId                           ││           │
│  │  │                                             ││           │
│  │  └─────────────────────────────────────────────┘│           │
│  │                                                 │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │              File Storage                        │           │
│  │                (data/)                          │           │
│  │                                                 │           │
│  │  Stored Models & Mappings:                      │           │
│  │  • recommendation_model.pkl                     │           │
│  │  • user_features.npz                            │           │
│  │  • item_features.npz                            │           │
│  │  • user_mapping.pkl                             │           │
│  │  • item_mapping.pkl                             │           │
│  │  • feature_mapping.pkl                          │           │
│  │                                                 │           │
│  │  Benefits:                                      │           │
│  │  • Fast model loading on startup                │           │
│  │  • Persistence across service restarts          │           │
│  │  • Version control of trained models            │           │
│  │                                                 │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Message Queue Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Message Queue Layer                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────┐           │
│  │                  RabbitMQ                        │           │
│  │                                                 │           │
│  │  Exchange: interaction_events (Topic)           │           │
│  │                                                 │           │
│  │  ┌─────────────────────────────────────────────┐│           │
│  │  │                Queues                       ││           │
│  │  │                                             ││           │
│  │  │  • product_views                            ││           │
│  │  │  • searches                                 ││           │
│  │  │  • interactions                             ││           │
│  │  │  • comparisons                              ││           │
│  │  │                                             ││           │
│  │  │  Queue Properties:                          ││           │
│  │  │  • Durable: true                            ││           │
│  │  │  • Auto-delete: false                       ││           │
│  │  │  • Message TTL: configured                  ││           │
│  │  │                                             ││           │
│  │  └─────────────────────────────────────────────┘│           │
│  │                                                 │           │
│  │  Message Flow:                                  │           │
│  │  1. Frontend/Banking Service → RabbitMQ         │           │
│  │  2. Queue Consumer → Message Processing         │           │
│  │  3. Processed Data → MongoDB                    │           │
│  │  4. Periodic Model Refresh                      │           │
│  │                                                 │           │
│  │  Error Handling:                                │           │
│  │  • Message acknowledgment                       │           │
│  │  • Dead letter queues                          │           │
│  │  • Retry mechanisms                             │           │
│  │                                                 │           │
│  └─────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Real-time Interaction Processing Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │    │             │
│  Frontend   │    │ Banking/    │    │  RabbitMQ   │    │Recommendation│
│Application  ├───►│Interaction  ├───►│   Queue     ├───►│   Service   │
│             │    │ Service     │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                  │
                                                                  ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │             │    │             │    │             │
                   │   Model     │    │   MongoDB   │    │   Queue     │
                   │ Training    │◄───┤ Interaction │◄───┤  Consumer   │
                   │             │    │   Storage   │    │             │
                   └─────────────┘    └─────────────┘    └─────────────┘

Flow Steps:
1. User interacts with frontend (view product, compare, etc.)
2. Interaction captured by Banking/Interaction Service
3. Event published to RabbitMQ queue
4. Recommendation Service consumes message
5. Processed interaction stored in MongoDB
6. Periodic model retraining with new data
```

### 2. Recommendation Generation Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │
│   Client    │    │  FastAPI    │    │Recommendation│
│ Application ├───►│   Router    ├───►│   Service   │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │
│ Product     │    │  Banking    │    │   Hybrid    │
│ Details     │◄───┤  Service    │◄───┤    Model    │
│ Enhanced    │    │   Client    │    │  (LightFM)  │
└─────────────┘    └─────────────┘    └─────────────┘
      │                                      ▲
      ▼                                      │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │
│  Response   │    │   Client    │    │   MongoDB   │
│ to Client   │◄───┤ Application │    │ Interaction │
│             │    │             │    │    Data     │
└─────────────┘    └─────────────┘    └─────────────┘

Flow Steps:
1. Client requests recommendations via API
2. RecommendationService processes request
3. Model generates predictions using stored embeddings
4. Banking Service provides product details
5. Enhanced recommendations returned to client
```

### 3. Model Training and Refresh Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │
│ Scheduler   │    │   Data      │    │   MongoDB   │
│ Triggers    ├───►│ Pipeline    ├───►│ Query for   │
│ Refresh     │    │             │    │Interactions │
└─────────────┘    └─────────────┘    └─────────────┘
      ▲                    │                   │
      │                    ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │
│   Model     │    │  Feature    │    │  Raw Data   │
│ Persistence │◄───┤Engineering  │◄───┤ Processing  │
│   (Files)   │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
      │                    │
      ▼                    ▼
┌─────────────┐    ┌─────────────┐
│             │    │             │
│   Model     │    │   LightFM   │
│ Available   │◄───┤  Training   │
│for Serving  │    │             │
└─────────────┘    └─────────────┘

Flow Steps:
1. Scheduler triggers model refresh (hourly/daily)
2. Data pipeline queries latest interaction data
3. Feature engineering processes raw interactions
4. LightFM model trains on processed data
5. Trained model and mappings saved to disk
6. New model becomes available for recommendations
```

## Technology Stack

### Core Technologies
- **Python 3.10**: Primary programming language
- **FastAPI**: Web framework for API development
- **LightFM**: Hybrid recommendation algorithm library
- **MongoDB**: NoSQL database for interaction data
- **RabbitMQ**: Message queue for real-time data ingestion
- **Docker**: Containerization and deployment

### Machine Learning Stack
- **LightFM**: Hybrid collaborative/content-based filtering
- **NumPy**: Numerical computing and matrix operations  
- **SciPy**: Sparse matrix operations and scientific computing
- **Pickle**: Model serialization and persistence

### Infrastructure
- **Motor**: Async MongoDB driver
- **aio-pika**: Async RabbitMQ client
- **aiohttp**: HTTP client for service communication
- **Uvicorn**: ASGI server for FastAPI

## Key Design Patterns

### 1. Dependency Injection Pattern
```python
async def get_recommendation_service(request: Request) -> RecommendationService:
    # Service resolution and caching at application level
```

### 2. Repository Pattern
```python
class DBService:
    # Abstraction layer for data access operations
```

### 3. Factory Pattern
```python
# Model creation and configuration management
```

### 4. Observer Pattern
```python
# Queue consumer for real-time event processing
```

## Scalability & Performance Considerations

### 1. Horizontal Scaling
- **Stateless Service Design**: No in-memory state between requests
- **Load Balancer Ready**: Multiple service instances can run concurrently
- **Database Connection Pooling**: Efficient resource utilization

### 2. Model Performance
- **Pre-computed Embeddings**: Fast inference using cached model representations
- **Batch Processing**: Efficient training on large datasets
- **Incremental Updates**: Periodic model refresh without downtime

### 3. Caching Strategy
- **Model Persistence**: Trained models saved to disk for fast startup
- **Popular Products Cache**: Fallback recommendations for cold start
- **Product Details Cache**: Redis integration for external API calls

### 4. Data Pipeline Optimization
- **Sparse Matrix Operations**: Memory-efficient data structures
- **Feature Engineering**: Optimized data processing pipeline
- **Batch Data Loading**: Efficient MongoDB queries with pagination

## Security & Reliability

### 1. Error Handling
- **Global Exception Handling**: Consistent error responses
- **Graceful Degradation**: Fallback to popular products on errors
- **Circuit Breaker Pattern**: External service failure handling

### 2. Data Validation
- **Pydantic Models**: Request/response validation
- **Input Sanitization**: Protection against malicious data
- **Type Safety**: Strong typing throughout the codebase

### 3. Monitoring & Observability
- **Structured Logging**: Comprehensive logging at all levels
- **Health Checks**: Service availability monitoring
- **Performance Metrics**: Model training and inference metrics

## Deployment Architecture

### Container Setup
```yaml
# docker-compose.yml services:
recommendation-service:  # Main application container
mongo:                  # MongoDB database
rabbitmq:              # Message queue with management UI
```

### Environment Configuration
- **Development**: Local Docker Compose setup
- **Production**: Kubernetes/Docker Swarm deployment
- **Configuration Management**: Environment variables and .env files

### Resource Requirements
- **CPU**: Multi-core for model training
- **Memory**: 2-4GB for model and feature matrices
- **Storage**: Persistent volumes for model files and MongoDB data
- **Network**: Inter-service communication within Docker network

## API Documentation

The service exposes a comprehensive REST API documented with OpenAPI 3.0:

### Core Endpoints
- `GET /health` - Service health status
- `GET /api/v1/recommendations/products/{user_id}` - User recommendations
- `GET /api/v1/recommendations/session/{session_id}` - Session-based recommendations  
- `GET /api/v1/recommendations/similar-products/{product_id}` - Similar products
- `POST /api/v1/recommendations/refresh-model` - Manual model refresh

### Response Format
```json
{
  "recommendations": [
    {
      "id": "product_id",
      "name": "Product Name",
      "category": "Category",
      "relevanceScore": 0.85,
      "rank": 1
    }
  ],
  "user_id": "user_123",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

This architecture provides a robust, scalable, and maintainable recommendation system that can adapt to growing user bases and evolving business requirements while maintaining high performance and reliability.
