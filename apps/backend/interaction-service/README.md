# Interaction Service

This is a microservice that tracks and logs user interactions with the FinVerse application. It helps generate personalized suggestions by collecting and analyzing user behavior patterns.

## Architecture

The Interaction Service follows a pub/sub architecture using:

- **Go** for high performance and concurrency
- **RabbitMQ** as the message broker for event-driven communication
- **MongoDB** for storing interaction logs and analytics data

## Features

- Track various types of user interactions:
  - General interactions (clicks, views, etc.)
  - Product views
  - Product comparisons
  - Search queries
- Provide analytics on user behavior
- Generate most viewed products report
- Support both authenticated and anonymous users

## API Endpoints

### Tracking Endpoints

- `POST /api/v1/interactions` - Track generic user interactions
- `POST /api/v1/product-views` - Track product views
- `POST /api/v1/comparisons` - Track product comparisons
- `POST /api/v1/searches` - Track user searches

### Analytics Endpoints

- `GET /api/v1/interactions/user/:userId` - Get interactions for a specific user
- `GET /api/v1/interactions/session/:sessionId` - Get interactions for a session
- `GET /api/v1/interactions/product/:productId` - Get interactions for a product
- `GET /api/v1/product-views/most-viewed` - Get most viewed products
- `GET /api/v1/interactions/stats` - Get interaction statistics

### Health Endpoint

- `GET /health` - Check service health

## Getting Started

### Prerequisites

- Go 1.21 or higher
- MongoDB
- RabbitMQ

### Running Locally

1. Make sure MongoDB and RabbitMQ are running locally or configure the service to connect to remote instances
2. Install dependencies:

```bash
go mod download
```

3. Run the service:

```bash
go run cmd/main.go
```

### Using Docker Compose

```bash
docker-compose up -d
```

This will start the interaction service, MongoDB, and RabbitMQ containers.

## Configuration

Configuration is handled through environment variables and/or a config file at `config/config.yaml`.

Key configurations:

- `server.port`: HTTP port (default: 4002)
- `mongodb.uri`: MongoDB connection string
- `rabbitmq.uri`: RabbitMQ connection string

## Integration with Other Services

The Interaction Service is designed to work alongside other FinVerse services:

1. The Banking Service API forwards relevant requests to this service
2. This service processes and stores the interaction data
3. Other services can query this service for user behavior data to generate suggestions

## License

Copyright (c) 2025 FinVerse - All Rights Reserved
