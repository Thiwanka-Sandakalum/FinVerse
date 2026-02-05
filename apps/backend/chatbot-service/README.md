# FinVerse Chatbot Service

A production-ready FastAPI backend for a financial chatbot with LLM integration, multi-database support, and a modern static chat UI.


## Requirements
- Python 3.11+
- MongoDB (Atlas or local)
- Docker (optional, for containerized deployment)
- Modular prompt templates (JSON)

## Environment Variables
Create a `.env` file in the project root:
```
MONGODB_URL=...         # MongoDB connection string
MONGODB_DB=...          # MongoDB database name
MONGODB_COLLECTION=...  # MongoDB collection name (default: services)
GEMINI_API_KEY=...      # Your Gemini LLM API key
ENV=development         # or production
LOG_LEVEL=INFO
```


## Features
- FastAPI backend with modular architecture
- LLM-driven response generation
- MongoDB support for product & chat history
- Modular prompt templates (JSON)
- Product and chat history models (MongoDB)
- Logging for LLM requests and responses
- Static chat UI (Markdown supported)
- Dockerized for easy deployment

## Local Development
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the API:
   ```bash
   uvicorn main:app --reload
   ```
3. Access the chat UI at: [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html)

## Docker Usage
1. Build the image:
   ```bash
   docker build -t finverse-chatbot .
   ```
2. Run the container:
   ```bash
   docker run --env-file .env -p 8000:8000 finverse-chatbot
   ```

## Project Structure
```
main.py
requirements.txt
api/
app/
core/
repositories/
schemas/
services/
utils/
static/
```

## API Endpoints
- `POST /chat` — Main chat endpoint (expects JSON: sessionId, message)
- `GET /static/index.html` — Chat UI

## LLM Prompting
- Prompts are modular and stored as JSON files in the prompts/ directory.
- LLM is instructed to return answers in Markdown for easy UI rendering.

## License
MIT
