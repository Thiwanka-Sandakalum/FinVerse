# FinVerse Chatbot Service Architecture

## Overview

The FinVerse Chatbot Service is a sophisticated financial advisory system that combines structured data queries with semantic search capabilities using a Retrieval-Augmented Generation (RAG) approach. Built with FastAPI and Python, the service provides intelligent responses to financial product inquiries through multiple specialized query processing pipelines.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Layer                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  Web Interface  │  REST API Clients  │  Mobile Apps  │  Third-party     │
│  (Static HTML)  │                    │               │  Integrations    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                            ┌───────▼───────┐
                            │               │
┌───────────────────────────┤   FastAPI     ├───────────────────────────┐
│                           │   Gateway     │                           │
│                           │   (main.py)   │                           │
│                           └───────────────┘                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    Core Orchestration                           │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │  │
│  │  │ Query           │  │ Query           │  │ Chat History    │   │  │
│  │  │ Orchestrator    ├──┤ Classifier      │  │ Service         │   │  │
│  │  │                 │  │                 │  │ (SQLite)        │   │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│  ┌─────────────────────────────────▼─────────────────────────────────┐  │
│  │                    Processing Services                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │  │
│  │  │ SQL Query   │  │ RAG Service │  │ Product     │  │ Product  │ │  │
│  │  │ Service     │  │ (Vector     │  │ Comparison  │  │ Chat     │ │  │
│  │  │             │  │  Search)    │  │ Service     │  │ Service  │ │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    External Services                            │  │
│  │  ┌─────────────────┐              ┌─────────────────────────────┐ │  │
│  │  │ Google Gemini   │              │     Database Layer          │ │  │
│  │  │ AI Services     │              │  ┌─────────────────────────┐ │ │  │
│  │  │                 │              │  │ PostgreSQL              │ │ │  │
│  │  │ • Gemini Pro    │              │  │ (Financial Products)    │ │ │  │
│  │  │ • Embeddings    │              │  └─────────────────────────┘ │ │  │
│  │  │ • Classification│              │  ┌─────────────────────────┐ │ │  │
│  │  └─────────────────┘              │  │ ChromaDB                │ │ │  │
│  │                                   │  │ (Vector Database)       │ │ │  │
│  │                                   │  └─────────────────────────┘ │ │  │
│  │                                   │  ┌─────────────────────────┐ │ │  │
│  │                                   │  │ SQLite                  │ │ │  │
│  │                                   │  │ (Chat History)          │ │ │  │
│  │                                   │  └─────────────────────────┘ │ │  │
│  │                                   └─────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

## System Components

### 1. API Gateway Layer

#### FastAPI Application (`main.py`)
- **Primary Endpoints**: `/chat`, `/product-chat`, `/compare-products`, `/ingest`
- **Management Endpoints**: Conversation management, product information, system stats
- **Authentication**: JWT-based user authentication with middleware
- **CORS Configuration**: Cross-origin request support
- **Static File Serving**: Web interface hosting

### 2. Core Orchestration Layer

#### Query Orchestrator (`query_orchestrator.py`)
- **Central Intelligence**: Coordinates all query processing workflows
- **Multi-modal Processing**: Handles SQL, Vector, and Hybrid query types
- **Statistics Tracking**: Query performance and type metrics
- **Response Assembly**: Combines data from multiple sources
- **Error Handling**: Graceful degradation and fallback mechanisms

#### Query Classifier (`query_classifier.py`)
- **AI-Powered Classification**: Uses Google Gemini for intelligent query categorization
- **Query Types**: 
  - `SQL`: Structured data queries (comparisons, specific product details)
  - `VECTOR`: General knowledge and conceptual questions
  - `HYBRID`: Complex queries requiring both structured and unstructured data
  - `UNSUPPORTED`: Out-of-scope queries
- **Rule-based Fallbacks**: Keyword-based classification for reliability

#### Chat History Service (`chat_history_service.py`)
- **SQLite Backend**: Persistent conversation storage
- **Multi-user Support**: User-scoped conversation management
- **Auto-cleanup**: Configurable conversation retention policies
- **Thread Safety**: Concurrent access handling

### 3. Processing Services Layer

#### SQL Query Service (`sql_query_service.py`)
- **Structured Queries**: Direct database queries for specific product information
- **Performance Optimized**: Efficient query patterns for financial data
- **Source Attribution**: Links responses to specific products/institutions

#### RAG Service (`rag_service.py`)
- **Vector Database**: ChromaDB for semantic search
- **Embedding Model**: Google's `embedding-001` model
- **Text Chunking**: Recursive character text splitter for optimal document processing
- **Context Retrieval**: Similarity-based document retrieval
- **Response Generation**: Google Gemini Pro for contextual answer generation

#### Product Comparison Service (`product_comparison_service.py`)
- **Multi-product Analysis**: Side-by-side comparison of financial products
- **Dynamic Attribute Comparison**: Handles products with different schemas
- **AI-generated Summaries**: Intelligent comparison narratives
- **Structured Output**: Markdown-formatted comparison tables

#### Product Chat Service (`product_chat_service.py`)
- **Product-focused Conversations**: Context-limited to specific products
- **Enhanced Context**: Combines product data with vector search
- **Conversation Continuity**: Maintains product-specific chat history

### 4. Data Layer

#### PostgreSQL Database
- **Primary Data Store**: Financial products, institutions, product types
- **ACID Compliance**: Transactional integrity for financial data
- **Prisma Integration**: Type-safe database access
- **Connection Pooling**: Efficient database resource management

#### ChromaDB Vector Database
- **Semantic Search**: High-dimensional vector storage and retrieval
- **Embedding Storage**: Product document embeddings
- **Similarity Metrics**: Cosine similarity for document matching
- **Persistent Storage**: Local file-based vector database

#### SQLite Chat History
- **Lightweight Storage**: Conversation and message persistence
- **User Isolation**: Per-user conversation management
- **Efficient Queries**: Optimized for chat history retrieval patterns

### 5. External Services

#### Google AI Services
- **Gemini 2.5 Flash**: Primary language model for response generation
- **Embedding Model**: Document and query vectorization
- **API Integration**: Async request handling with retry logic

## Data Flow Architecture

### 1. Standard Chat Query Flow

```
User Query → FastAPI → Query Orchestrator → Query Classifier
                                    ↓
                         ┌──────────┴──────────┐
                         │                     │
                    [SQL Query]          [Vector Query]
                         │                     │
                         ▼                     ▼
                SQL Query Service      RAG Service
                         │                     │
                         ▼                     ▼
                   PostgreSQL            ChromaDB
                         │                     │
                         └──────────┬──────────┘
                                    ▼
                           Response Assembly
                                    │
                                    ▼
                          Chat History Storage
                                    │
                                    ▼
                            JSON Response
```

### 2. Product Comparison Flow

```
Product IDs → Product Comparison Service → Database Retrieval
                            │
                            ▼
                   Raw Product Data
                            │
                            ▼
               AI-Powered Comparison Analysis
                            │
                            ▼
            Structured Comparison + Markdown Summary
                            │
                            ▼
                   Chat History Storage
                            │
                            ▼
                    JSON Response
```

### 3. Product-Specific Chat Flow

```
Query + Product ID → Product Chat Service → Product Data Retrieval
                              │
                              ▼
                     Enhanced Context Building
                              │
                              ▼
                        RAG Processing
                              │
                              ▼
                   Product-Scoped Response
                              │
                              ▼
                    Chat History Storage
```

## Technology Stack

### Backend Framework
- **FastAPI**: High-performance async Python web framework
- **Uvicorn**: ASGI server for production deployment
- **Pydantic**: Data validation and serialization

### AI/ML Stack
- **Google Generative AI**: Gemini models for text generation and classification
- **LangChain**: Framework for AI application development
- **ChromaDB**: Vector database for semantic search
- **Tiktoken**: Token counting and text processing

### Databases
- **PostgreSQL**: Primary relational database
- **SQLite**: Chat history persistence
- **ChromaDB**: Vector embeddings storage

### Development & Deployment
- **Docker**: Containerization and orchestration
- **Docker Compose**: Multi-service local development
- **Python 3.10+**: Runtime environment

## Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication mechanism
- **User Context**: Request-scoped user identification
- **Middleware Integration**: Transparent auth handling

### Data Protection
- **Input Validation**: Pydantic model validation
- **SQL Injection Prevention**: Parameterized queries through Prisma
- **CORS Configuration**: Controlled cross-origin access

### API Security
- **Rate Limiting**: Configurable request throttling
- **Error Handling**: Sanitized error responses
- **Logging**: Comprehensive audit trails

## Performance Characteristics

### Scalability
- **Async Architecture**: Non-blocking I/O operations
- **Connection Pooling**: Efficient database resource usage
- **Stateless Design**: Horizontal scaling capability
- **Caching Strategy**: Vector search result optimization

### Response Times
- **SQL Queries**: < 100ms typical response time
- **Vector Search**: < 300ms with embedding retrieval
- **AI Generation**: 1-3 seconds for complex responses
- **Product Comparison**: 2-5 seconds for multi-product analysis

### Resource Utilization
- **Memory Efficient**: Streaming response generation
- **CPU Optimized**: Async processing patterns
- **Storage Optimization**: Efficient vector indexing

## Configuration Management

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_API_KEY`: Google AI services authentication
- `PORT`: Service port configuration (default: 8085)
- `ENVIRONMENT`: Deployment environment flag
- `LOG_LEVEL`: Logging verbosity control

### Feature Flags
- Chat history inclusion toggle
- Query type processing enablement
- AI service fallback mechanisms

## Monitoring & Observability

### Logging Framework
- **Structured Logging**: JSON-formatted log entries
- **Service-level Logging**: Per-component log isolation
- **Error Tracking**: Exception logging with stack traces

### Metrics Collection
- **Query Statistics**: Type distribution and performance metrics
- **Response Time Tracking**: Moving averages and percentiles
- **Error Rate Monitoring**: Service health indicators

### Health Checks
- **Database Connectivity**: PostgreSQL and SQLite health
- **AI Service Status**: Google API availability
- **Vector Database Health**: ChromaDB accessibility

## Deployment Architecture

### Container Configuration
- **Multi-stage Builds**: Optimized Docker images
- **Volume Persistence**: Data directory mounting
- **Network Isolation**: Service-specific networking

### Service Dependencies
- **Database Dependencies**: PostgreSQL startup orchestration
- **AI Service Integration**: External API dependency management
- **Storage Initialization**: Vector database setup automation

## Future Architecture Considerations

### Scalability Enhancements
- **Microservices Decomposition**: Service separation for independent scaling
- **Message Queue Integration**: Async processing workflows
- **Distributed Caching**: Redis integration for response caching

### AI/ML Improvements
- **Model Fine-tuning**: Domain-specific language model training
- **Embedding Optimization**: Custom embedding models for financial domain
- **Multi-modal Support**: Image and document processing capabilities

### Data Architecture Evolution
- **Data Lake Integration**: Historical conversation analytics
- **Real-time Streaming**: Live data processing pipelines
- **Advanced Analytics**: User behavior and query pattern analysis

---

*This architecture document represents the current state of the FinVerse Chatbot Service and serves as a reference for development, deployment, and maintenance activities.*
