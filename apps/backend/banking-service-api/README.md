# Banking Service API

A comprehensive microservice for financial product management in the FinVerse ecosystem, providing advanced features for product discovery, comparison, and user interaction tracking with integrated machine learning capabilities.

## 🏗️ Architecture Overview

The Banking Service API is the core service in FinVerse's microservices architecture, responsible for:

- **Financial Product Management**: Complete CRUD operations for diverse financial products
- **Institution Management**: Multi-tenant support for financial institutions
- **Real-time User Interaction Tracking**: ML-powered recommendation engine integration
- **Advanced Search & Filtering**: Intelligent product discovery mechanisms
- **User Experience Features**: Bookmarking, comparison lists, reviews, and social sharing
- **Enterprise Integration**: RabbitMQ message queues and event-driven architecture

## 🚀 Key Features

### Core Product Management
- **Multi-Category Support**: Cards, Loans, Mortgages, Insurance, Bank Accounts, Investment Products
- **Hierarchical Product Classification**: Categories → Types → Products with flexible taxonomy
- **Version Control**: Complete product history tracking with change logs
- **Rate History Tracking**: Time-series data for interest rates and financial metrics
- **Feature Tagging**: Flexible labeling system for product attributes

### User Experience & Engagement
- **Smart Product Discovery**: AI-powered search with relevance scoring
- **Personal Collections**: Save/bookmark products for later comparison
- **Dynamic Comparison Lists**: Multi-product feature comparison capabilities
- **Social Sharing Integration**: WhatsApp, Email, and other channel integrations
- **Community Reviews & Ratings**: User-generated content with moderation

### Enterprise Architecture
- **Event-Driven Design**: RabbitMQ integration for real-time data processing
- **Multi-Tenant Security**: Institution-level data isolation and access control
- **Microservices Integration**: Seamless communication with Recommendation and Chatbot services
- **Horizontal Scalability**: Docker containerization with health monitoring

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database ORM**: Prisma 6.x with PostgreSQL
- **Authentication**: Clerk + JWT (JSON Web Tokens)
- **Message Queue**: RabbitMQ with AMQP
- **Containerization**: Docker with Multi-stage builds

### Development Tools
- **Validation**: Custom validators with Express middleware
- **Logging**: Winston with structured logging
- **Testing**: Jest with Supertest for integration testing
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **API Documentation**: OpenAPI 3.0.3 specification

### Infrastructure & DevOps
- **Health Monitoring**: Built-in health checks with database connectivity
- **CORS**: Configurable cross-origin resource sharing
- **Security**: Helmet.js security headers + input sanitization
- **Database Migrations**: Prisma migrations with seed data
- **Hot Reload**: ts-node-dev for development

## 📊 Database Architecture

### Entity Relationship Design
The database follows a normalized relational model with clear separation of concerns:

#### Core Entities
```
InstitutionType (1) ──< (N) Institution (1) ──< (N) Product
                                                    │
ProductCategory (1) ──< (N) ProductType (1) ──< (N)┘
                                                    │
                                           ProductTag (N) ──< (N) ProductTagMap
```

#### User Interaction Entities
```
Product (1) ──< (N) SavedProduct
Product (1) ──< (N) Review
Product (1) ──< (N) SharedLink
Product (1) ──< (N) ProductRateHistory
Product (1) ──< (N) ProductVersion
```

### Data Models Deep Dive

#### **InstitutionType & Institution**
- **Purpose**: Multi-tenant institution management
- **Features**: Type-based categorization (Bank, Credit Union, etc.)
- **Security**: Institution-level data isolation
- **Scalability**: Supports unlimited institutions per type

#### **ProductCategory & ProductType**
- **Hierarchy**: Supports nested categories with unlimited depth
- **Flexibility**: Dynamic taxonomy creation without code changes
- **Examples**: 
  - Loans → Personal Loans, Car Loans, Mortgages
  - Cards → Credit Cards, Debit Cards, Prepaid Cards

#### **Product (Core Entity)**
- **JSON Storage**: Flexible `details` field for product-specific attributes
- **Versioning**: Complete history tracking via ProductVersion
- **Features**: Featured products, active/inactive states
- **Search**: Full-text search on name, slug, and JSON details

#### **User Interaction Models**
- **SavedProduct**: User bookmarking with Clerk user ID reference
- **CompareList**: Multi-product comparison with array storage
- **Review**: 1-5 star rating system with optional comments
- **SharedLink**: Social sharing tracking with channel attribution
- **ProductRateHistory**: Time-series financial data (rates, fees, etc.)

## 🏛️ Service Architecture

### Layer Architecture
```
┌─────────────────────────────────────────────────────────┐
│                  HTTP Layer                             │
│  Routes → Controllers → Middleware → Error Handling     │
├─────────────────────────────────────────────────────────┤
│                 Business Layer                          │
│     Services → Domain Logic → Validation               │
├─────────────────────────────────────────────────────────┤
│                  Data Layer                             │
│  Repositories → Prisma ORM → PostgreSQL Database       │
├─────────────────────────────────────────────────────────┤
│               Integration Layer                         │
│  Queue Service → RabbitMQ → External Services          │
└─────────────────────────────────────────────────────────┘
```

### Service Layer Details

#### **Controllers (`src/controllers/`)**
Each controller handles HTTP request/response logic for specific domains:
- `product.controller.ts` - Product CRUD + search
- `institution.controller.ts` - Institution management
- `saved-product.controller.ts` - User bookmarking
- `review.controller.ts` - Rating & review system
- `compare-list.controller.ts` - Product comparison
- `shared-link.controller.ts` - Social sharing

#### **Services (`src/services/`)**
Business logic layer with domain-specific operations:
- `product.service.ts` - Product business rules
- `interaction-tracking.service.ts` - User behavior analytics
- `queue.service.ts` - Message queue management
- Institution, review, and tag services for specialized logic

#### **Repositories (`src/repositories/`)**
Data access layer with Prisma integration:
- Encapsulates all database operations
- Provides clean abstraction over Prisma queries
- Handles pagination, filtering, and complex joins
- Supports transaction management

#### **Middleware (`src/middlewares/`)**
- `auth.middleware.ts` - JWT validation + optional auth
- `error.middleware.ts` - Centralized error handling + async wrapper
- Validation middleware for request sanitization

## 🔄 Message Queue Integration

### RabbitMQ Event-Driven Architecture

#### Message Flow
```
Banking Service → RabbitMQ Exchange → Topic Routing → Specific Queues → Recommendation Service
                                                  ↘
                                                   → Chatbot Service
```

#### Queue Configuration
- **Exchange**: `interaction_events` (topic exchange)
- **Queues**:
  - `product_views` - User product viewing behavior
  - `searches` - Search queries and filters
  - `comparisons` - Product comparison interactions
  - `interactions` - General user interactions

#### Event Types

**Product View Event**:
```typescript
{
  action: 'product_view',
  userId?: string,
  productId: string,
  productData: {
    name: string,
    categoryId: string,
    institutionId: string,
    interestRate?: number,
    // ... additional metadata
  },
  timestamp: Date,
  source: 'banking-service'
}
```

**Search Event**:
```typescript
{
  action: 'search',
  userId?: string,
  query: string,
  filters: {
    categoryId?: string,
    institutionId?: string,
    // ... search parameters
  },
  resultCount: number,
  timestamp: Date
}
```

### Benefits
- **Real-time Recommendations**: Feed ML models with user behavior
- **Analytics**: Track user journeys and product performance  
- **Scalability**: Async processing doesn't block API responses
- **Resilience**: Message persistence + connection recovery

## 🔐 Authentication & Authorization

### Clerk Integration
- **JWT Tokens**: Stateless authentication with user context
- **User Identification**: Clerk user IDs for all user-specific operations
- **Optional Auth**: Public endpoints with optional user context for personalization

### Authorization Levels
- **Public Access**: Product browsing, institution listings
- **Authenticated Users**: Bookmarking, reviews, comparisons
- **Institution Admins**: Manage own institution's products
- **System Admins**: Full CRUD across all entities

### Security Features
- **Institution Isolation**: Users can only manage their institution's data
- **Input Validation**: Comprehensive request sanitization
- **Error Handling**: Secure error messages without data leakage
- **CORS Configuration**: Configurable cross-origin policies

## 📡 API Design & Documentation

### RESTful Principles
- **Resource-based URLs**: `/products`, `/institutions`, `/reviews`
- **HTTP Verbs**: GET, POST, PUT, DELETE for CRUD operations
- **Status Codes**: Proper HTTP status code usage
- **Content-Type**: JSON request/response format

### OpenAPI 3.0.3 Specification
- **Complete Documentation**: All endpoints, schemas, and examples
- **Interactive Testing**: Swagger UI integration
- **Schema Validation**: Request/response validation
- **Code Generation**: Client SDK generation support

### Pagination & Filtering
```typescript
// Query Parameters
{
  limit: number = 20,      // Results per page
  offset: number = 0,      // Results to skip
  search?: string,         // Full-text search
  categoryId?: string,     // Filter by category
  institutionId?: string,  // Filter by institution
  isActive?: boolean,      // Active/inactive products
  isFeatured?: boolean     // Featured products only
}

// Response Format
{
  data: Product[],
  meta: {
    total: number,
    limit: number,
    offset: number
  }
}
```

## 🔧 Configuration Management

### Environment Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/banking_service"

# Server Configuration  
NODE_ENV="development|production"
PORT="8181"
CORS_ORIGIN="http://localhost:3000,https://app.finverse.com"

# Authentication
CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Message Queue
RABBITMQ_URI="amqp://guest:guest@localhost:5672/"
RABBITMQ_EXCHANGE="interaction_events"
RABBITMQ_PRODUCT_VIEW_QUEUE="product_views"
RABBITMQ_INTERACTION_QUEUE="interactions"
RABBITMQ_COMPARISON_QUEUE="comparisons" 
RABBITMQ_SEARCH_QUEUE="searches"

# Logging
ENABLE_REQUEST_LOGGING="true"
```

### Health Monitoring
The `/health` endpoint provides comprehensive system status:
```json
{
  "status": "OK",
  "timestamp": "2025-08-13T...",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "database": "Connected",
  "messageQueue": "Connected"
}
```

## Tech Stack

## Setup Instructions

### Prerequisites

- Node.js
- MySQL 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd apps/banking-service-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   - Edit `.env` file with your actual database connection details and JWT secret

4. Run database migrations:
   ```
   npm run prisma:migrate
   ```

5. Generate Prisma client:
   ```
   npm run prisma:generate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Docker Deployment

#### Using Docker Compose (Recommended)

1. Copy the environment file:
   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration

3. Run with Docker Compose:
   ```bash
   # For production
   docker-compose up -d
   
   # For development
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. Run database migrations:
   ```bash
   # Access the container and run migrations
   docker-compose exec banking-service npx prisma migrate deploy
   
   # Seed the database (optional)
   docker-compose exec banking-service npm run prisma:seed
   ```

#### Using Docker Only

1. Build the Docker image:
   ```bash
## 🔧 Development Setup

### Prerequisites
- **Node.js**: 20.x LTS or higher
- **PostgreSQL**: 12.x or higher
- **RabbitMQ**: 3.x (for development with message queuing)
- **Docker**: Latest version (for containerized development)

### Quick Start

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd banking-service-api
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and service configuration
   ```

3. **Database Setup**:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   npm run prisma:generate
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

### Development Scripts
```bash
# Development
npm run dev              # Start with hot-reload
npm run build            # TypeScript compilation
npm start               # Production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Database GUI
npm run prisma:seed      # Seed data

# Quality Assurance
npm run lint            # ESLint checking
npm run lint:fix        # ESLint auto-fix
npm run format          # Prettier formatting
npm run format:check    # Format validation
npm test               # Jest test suite
```

### Docker Development
```bash
# Build development image
docker build -f Dockerfile -t banking-service-api .

# Run with docker-compose
docker-compose -f docker-compose.dev.yml up

# Production build
docker build -t banking-service-api:prod .
```

## 🚀 Deployment

### Azure App Service
The service is optimized for Azure App Service deployment:

1. **Environment Variables**: Configure in Azure portal
2. **Database**: Azure Database for PostgreSQL
3. **Health Checks**: Built-in `/health` endpoint
4. **Startup Command**: `npx prisma generate && node dist/index.js`

### Container Deployment
```bash
# Build production image
docker build -t banking-service-api:latest .

# Run in production
docker run -p 8181:8181 \
  -e DATABASE_URL="your-connection-string" \
  -e NODE_ENV=production \
  banking-service-api:latest
```

### Environment Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@host:5432/banking_service"

# Server Configuration  
NODE_ENV="development|production"
PORT="8181"
CORS_ORIGIN="http://localhost:3000,https://app.finverse.com"

# Authentication
CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Message Queue
RABBITMQ_URI="amqp://guest:guest@localhost:5672/"
RABBITMQ_EXCHANGE="interaction_events"
RABBITMQ_PRODUCT_VIEW_QUEUE="product_views"
RABBITMQ_INTERACTION_QUEUE="interactions"
RABBITMQ_COMPARISON_QUEUE="comparisons" 
RABBITMQ_SEARCH_QUEUE="searches"

# Logging
ENABLE_REQUEST_LOGGING="true"
```

## 🧪 Testing

### Test Suite
```bash
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

### Test Categories
- **Unit Tests**: Service and utility function testing
- **Integration Tests**: API endpoint and database testing
- **Load Tests**: Performance and concurrency validation

## 📈 Monitoring & Health

### Health Check
```http
GET /health HTTP/1.1
Host: api.finverse.com

Response:
{
  "status": "OK",
  "timestamp": "2025-08-13T...",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0",
  "database": "Connected",
  "messageQueue": "Connected"
}
```

### Logging
- **Structured Logging**: Winston with JSON format
- **Request Logging**: Morgan middleware integration
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time tracking

## 🔗 Integration Points

### Recommendation Service
- **Message Queue**: RabbitMQ event publishing
- **Data Flow**: User interaction → Queue → ML Model
- **Event Types**: Product views, searches, comparisons

### Chatbot Service
- **API Integration**: RESTful product queries
- **Data Sharing**: Product information for chat responses
- **Real-time Updates**: Product availability and features

### Frontend Applications
- **RESTful API**: Complete CRUD operations
- **Real-time Updates**: WebSocket support for live data
- **Authentication**: Clerk JWT integration

## 📚 Additional Documentation

### Related Files
- [`AZURE_DEPLOYMENT.md`](AZURE_DEPLOYMENT.md) - Azure App Service configuration
- [`RABBITMQ_INTEGRATION.md`](RABBITMQ_INTEGRATION.md) - Message queue implementation
- [`banking-service-api.yaml`](banking-service-api.yaml) - OpenAPI 3.0.3 specification

### Architecture Diagrams
- **Database ERD**: Entity relationship diagrams in documentation
- **Service Communication**: Inter-service communication patterns
- **Data Flow**: User interaction to recommendation pipeline

## 🤝 Contributing

### Development Process
1. **Feature Branches**: Create feature branches from main
2. **Code Quality**: ESLint, Prettier, TypeScript compliance
3. **Testing**: Comprehensive test coverage
4. **Documentation**: Update API documentation and README

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with customizations
- **Prettier**: Consistent code formatting
- **Commit Messages**: Conventional commit format

## 🆔 Version History

### v1.0.0 (Current)
- ✅ Core product management system
- ✅ Multi-tenant institution support
- ✅ User interaction tracking
- ✅ RabbitMQ message queue integration
- ✅ Comprehensive API documentation
- ✅ Docker containerization
- ✅ Azure deployment optimization

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ by the FinVerse API Team**

For questions, issues, or contributions, please refer to our [GitHub repository](https://github.com/Thiwanka-Sandakalum/FinVerse) or contact the API team.