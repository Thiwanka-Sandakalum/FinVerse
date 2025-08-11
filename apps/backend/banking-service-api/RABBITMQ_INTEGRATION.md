# RabbitMQ Integration Implementation

## Overview
This document describes the implementation of RabbitMQ message queue integration between the Banking Service and the Recommendation Service for tracking user interactions with financial products.

## Architecture

### Message Flow
1. **Banking Service** → Publishes interaction events → **RabbitMQ Exchange** 
2. **RabbitMQ Exchange** → Routes messages → **Specific Queues** 
3. **Interaction Service** → Consumes messages → **MongoDB Storage**
4. **Recommendation Service** → Uses stored data → **Generate Recommendations**

### Queue Configuration
- **Exchange**: `interaction_events` (topic exchange)
- **Queues**:
  - `product_views`: Product view interactions
  - `interactions`: General interactions  
  - `searches`: Search interactions
  - `comparisons`: Product comparison interactions

## Implementation Details

### 1. Queue Service (`src/services/queue.service.ts`)
- Manages RabbitMQ connection and channel
- Handles connection recovery and error handling
- Publishes interaction events to appropriate queues
- Provides singleton instance for application-wide usage

### 2. Interaction Tracking Service (`src/services/interaction-tracking.service.ts`)  
- High-level interface for tracking different interaction types
- Extracts request metadata (IP, User-Agent, etc.)
- Formats interaction data into standardized event structures
- Handles errors gracefully without breaking main functionality

### 3. Product Controller Integration
- **Product View Tracking**: Automatically tracks when users access `/products/{id}`
- **Search Tracking**: Records search queries and filters when users search products
- **Non-blocking**: Interaction tracking runs asynchronously without affecting API response time

## Event Types

### Product View Event
```typescript
{
  action: 'product_view',
  userId?: string,
  sessionId: string,
  productId: string,
  productData: {
    name: string,
    categoryId: string,
    categoryName?: string,
    productTypeId: string,
    productTypeName?: string,
    institutionId: string,
    institutionName?: string,
    interestRate?: number,
    isActive: boolean,
    isFeatured: boolean
  },
  timestamp: Date,
  source: 'banking-service',
  userAgent?: string,
  ipAddress?: string,
  referrer?: string
}
```

### Search Event
```typescript
{
  action: 'search',
  userId?: string,
  sessionId: string,
  query: string,
  filters?: {
    categoryId?: string,
    institutionId?: string,
    productTypeId?: string,
    isFeatured?: boolean,
    isActive?: boolean
  },
  resultCount: number,
  timestamp: Date,
  source: 'banking-service',
  userAgent?: string,
  ipAddress?: string,
  referrer?: string
}
```

## Configuration

### Environment Variables
```bash
RABBITMQ_URI=amqp://guest:guest@localhost:5672/
RABBITMQ_EXCHANGE=interaction_events
RABBITMQ_PRODUCT_VIEW_QUEUE=product_views
RABBITMQ_INTERACTION_QUEUE=interactions
RABBITMQ_COMPARISON_QUEUE=comparisons
RABBITMQ_SEARCH_QUEUE=searches
RABBITMQ_RECONNECT_ATTEMPTS=5
RABBITMQ_RECONNECT_DELAY=5000
```

## Health Check Integration
The `/health` endpoint now includes RabbitMQ connection status:
```json
{
  "status": "OK",
  "database": "Connected",
  "messageQueue": "Connected",
  "timestamp": "2025-08-11T10:30:00.000Z"
}
```

## Error Handling & Resilience

### Connection Recovery
- Automatic reconnection on connection failure
- Configurable retry attempts and delays
- Graceful degradation when queue is unavailable

### Non-blocking Design  
- Interaction tracking failures don't affect API responses
- Errors are logged but don't propagate to users
- Service continues to function without queue connectivity

## Usage Examples

### Tracked Interactions
1. **Product View**: `GET /products/123` → Generates product view event
2. **Product Search**: `GET /products?search=loan&categoryId=456` → Generates search event
3. **Filtered Browse**: `GET /products?institutionId=789` → Generates search event

### Data Flow to Recommendation Engine
1. User views mortgage products → Product view events sent to queue
2. Interaction service stores events in MongoDB  
3. Recommendation service analyzes user behavior patterns
4. System generates personalized product recommendations
5. Future API calls can include "recommended for you" sections

## Benefits

### For Recommendation System
- **User Behavior Profiles**: Build comprehensive user interaction history
- **Product Popularity Metrics**: Track which products get most views
- **Search Pattern Analysis**: Understand what users are looking for
- **Personalization**: Generate tailored product recommendations

### For Analytics
- **User Journey Tracking**: Follow user paths through product discovery
- **A/B Testing Support**: Track effectiveness of different UI presentations  
- **Business Intelligence**: Understand product performance and user preferences

## Future Enhancements

1. **Additional Event Types**:
   - Product comparison events
   - Application start events
   - Bookmark/save events

2. **Enhanced Metadata**:
   - Geographic information
   - Device type detection
   - Session duration tracking

3. **Real-time Analytics**:
   - Live user activity dashboards
   - Real-time recommendation updates
   - Trending products detection

## Testing

### Local Development
1. Start RabbitMQ: `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`
2. Access management UI: http://localhost:15672 (guest/guest)
3. Start banking service: `npm run dev`
4. Test endpoints and monitor queue messages

### Production Deployment
- Ensure RabbitMQ cluster is configured for high availability
- Monitor queue depths and message processing rates
- Set up alerts for connection failures or high error rates
