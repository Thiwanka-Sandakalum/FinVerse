# FinVerse Chatbot Service

Financial Product Chatbot Service with Retrieval-Augmented Generation (RAG)

## Overview

This service provides a conversational interface for querying information about financial products in Sri Lanka. It uses a hybrid approach combining structured data from a PostgreSQL database with unstructured data from a vector store, providing accurate and contextual responses to user queries.

## Features

- Automatic query classification (SQL, Vector, Hybrid)
- Structured data retrieval from PostgreSQL
- Semantic search with vector database (ChromaDB)
- Multi-turn conversations with chat history
- JSON response formatting
- Simple web interface for testing

## API Endpoints

### Chat

```
POST /chat
```

Send a query to the chatbot and get a response.

**Request Body:**
```json
{
  "query": "What are the best fixed deposit rates?",
  "conversation_id": "optional-conversation-id",
  "include_history": true
}
```

**Response:**
```json
{
  "answer": "The best fixed deposit rates currently available are...",
  "sources": [
    {
      "name": "FD Premium",
      "institution": "ABC Bank",
      "product_id": "abc-fd-123"
    }
  ],
  "conversation_id": "conversation-uuid",
  "query_type": "sql",
  "history": [
    {
      "text": "What are the best fixed deposit rates?",
      "role": "user",
      "timestamp": "2023-08-08T10:30:00.000Z"
    },
    {
      "text": "The best fixed deposit rates currently available are...",
      "role": "assistant",
      "timestamp": "2023-08-08T10:30:05.000Z"
    }
  ]
}
```

### Conversation Management

```
GET /conversations
```
Get a list of all conversations.

```
GET /conversations/{conversation_id}/history
```
Get message history for a specific conversation.

```
DELETE /conversations/{conversation_id}
```
Delete a conversation and all its messages.

```
POST /conversations/cleanup?days=30
```
Delete conversations older than specified days.

### Product Information

```
GET /products/{product_id}
```
Get detailed information about a specific product.

```
GET /institutions
```
Get a list of all financial institutions.

### System Information

```
GET /stats
```
Get statistics about processed queries.

```
POST /ingest
```
Ingest products from the database into the vector store.

## Components

- **QueryClassifier**: Determines the type of query (SQL, Vector, Hybrid)
- **SQLQueryService**: Handles structured data queries to PostgreSQL
- **RAGService**: Manages vector search and response generation
- **ChatHistoryService**: Manages conversation history in SQLite
- **CustomJSONEncoder**: Handles serialization of Decimal types

## Database Schema

The service uses two databases:

1. **PostgreSQL**: Stores structured financial product data
2. **SQLite**: Stores chat history

### Chat History Schema

**conversations table:**
- id (TEXT): Conversation UUID
- created_at (TEXT): ISO timestamp
- updated_at (TEXT): ISO timestamp

**messages table:**
- id (INTEGER): Auto-increment ID
- conversation_id (TEXT): Foreign key to conversations
- role (TEXT): "user" or "assistant"
- text (TEXT): Message content
- timestamp (TEXT): ISO timestamp

## Getting Started

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Start the service:
   ```
   bash start.sh
   ```

3. Access the web interface at http://localhost:8000

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: API key for OpenAI
- `PORT`: Server port (default: 8000)
