# FinVerse Chatbot Service

A sophisticated Financial Product RAG (Retrieval-Augmented Generation) Chatbot service built with FastAPI, PostgreSQL, and advanced AI capabilities. This service provides intelligent financial product recommendations, comparisons, and personalized chat experiences for Sri Lankan financial services.

## 🚀 Features

### Core Chat Functionality
- **Multi-turn Conversations**: Persistent chat history with SQLite storage
- **Query Classification**: Intelligent routing between SQL, Vector, and Hybrid queries
- **RAG Integration**: Combines structured database queries with vector search
- **JSON Serialization**: Custom handling for PostgreSQL Decimal types

### Product Comparison Engine
- **Multi-Product Comparison**: Compare up to 10 financial products simultaneously
- **Structured Analysis**: Automatically identify best options across different criteria
- **Smart Recommendations**: AI-powered suggestions based on user needs
- **Comparison History**: Cache and retrieve previous comparisons for follow-up questions

### Product-Specific Chat
- **Focused Conversations**: Deep-dive discussions about individual products
- **Related Products**: Automatic discovery and inclusion of similar options
- **Contextual Responses**: Product details integrated into every response
- **Comparison Integration**: Seamlessly transition from product chat to comparisons

### Advanced Search & Discovery
- **Flexible Search**: Text search across product names and descriptions
- **Multi-Criteria Filtering**: Filter by type, institution, amounts, and interest rates
- **Similar Products**: Find products of the same type for easy comparison
- **Smart Categorization**: Automatic grouping by product type and institution

## 🛠️ Technology Stack

- **Backend**: FastAPI with Python 3.10+
- **Database**: PostgreSQL with Prisma ORM
- **Chat History**: SQLite for conversation persistence  
- **Vector Store**: ChromaDB for document embeddings
- **AI/ML**: OpenAI GPT for response generation
- **Search**: Hybrid approach combining SQL and vector similarity

## 📋 API Endpoints

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
