# Interaction Service Implementation Summary

## Architecture Overview

The Interaction Service is designed as a pub/sub microservice that tracks user behaviors to help generate personalized suggestions. Here's a high-level overview of the architecture:

```
┌──────────────────────┐     ┌─────────────┐     ┌─────────────────┐
│                      │     │             │     │                 │
│  Banking Service API ├─────► API Gateway ├─────► Interaction     │
│                      │     │             │     │ Service API     │
└──────────────────────┘     └─────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │    RabbitMQ     │
                                                │                 │
                                                └────────┬────────┘
                                                          │
                                                          ▼
                                                ┌─────────────────┐
                                                │                 │
                                                │    MongoDB      │
                                                │                 │
                                                └─────────────────┘
```

## Components

1. **Go Service** - Main interaction tracking service
   - High performance, concurrent processing
   - REST API endpoints for direct tracking
   - Consumes events from RabbitMQ queues
   - Stores interactions in MongoDB

2. **RabbitMQ** - Message broker
   - Enables asynchronous processing
   - Provides message persistence
   - Decouples the tracking from the main application flow
   - Supports multiple event types (interaction, product view, comparison, search)

3. **MongoDB** - Database
   - Schema-flexible for various event types
   - Optimized for high write loads
   - Efficient for analytics queries
   - Good for time-series data like user interactions

4. **Banking Service Integration**
   - Middleware in the banking service to track relevant requests
   - Only tracks GET requests to product and information pages
   - Extracts user ID from authentication when available
   - Uses session cookies for anonymous tracking

## Event Types

The service tracks several types of events:

1. **General Interactions** - Generic user actions (clicks, views, etc.)
2. **Product Views** - When users view specific products
3. **Comparison Events** - When users compare multiple products
4. **Search Events** - User search queries and filters
5. **Application Intents** - When users show interest in applying for a product

## API Endpoints

The service provides REST endpoints for:

1. **Tracking** - POST endpoints to track different event types
2. **Analytics** - GET endpoints to retrieve user behavior data
3. **Health Check** - Endpoint to verify service status

## Data Flow

1. User interacts with the application
2. Banking Service middleware intercepts relevant requests
3. Events are sent to the Interaction Service API
4. Interaction Service publishes events to RabbitMQ
5. Consumer processes store events in MongoDB
6. Analytics endpoints query the database to provide insights

## Benefits

1. **Performance** - Asynchronous processing doesn't slow down main application
2. **Reliability** - Message persistence ensures no data loss
3. **Scalability** - Each component can scale independently
4. **Flexibility** - Easy to add new event types or tracking points
