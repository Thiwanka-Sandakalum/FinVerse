# FinVerse Chatbot Service

A production-ready FastAPI backend for a financial chatbot with LLM integration, multi-database support, and a modern static chat UI.

## Features
- FastAPI backend with modular architecture
- LLM-driven SQL and response generation
- MySQL (Azure) multi-database support (product & chat history)
- Modular prompt templates (JSON)
- Product and chat history models
- Logging for LLM requests and responses
- Static chat UI (Markdown supported)
- Dockerized for easy deployment

## Requirements
- Python 3.11+
- MySQL (Azure, with SSL)
- Docker (optional, for containerized deployment)

## Environment Variables
Create a `.env` file in the project root:
```
PRODUCT_DB_URL=...   # MySQL URL for product DB
CHAT_DB_URL=...      # MySQL URL for chat history DB
GEMINI_API_KEY=...   # Your Gemini LLM API key
ENV=development      # or production
LOG_LEVEL=INFO
```

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
