from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import Any
import logging
import os
from fastapi.responses import JSONResponse
from src.utils.json_utils import CustomJSONEncoder
import json

from src.services.database_service import get_db, DatabaseService
from src.services.rag_service import RAGService
from src.services.query_orchestrator import QueryOrchestrator
from src.services.chat_history_service import ChatHistoryService
from src.services.product_comparison_service import ProductComparisonService
from src.services.product_chat_service import ProductChatService
from src.routes import create_router
class CustomJSONResponse(JSONResponse):
    """Custom JSON Response that uses our CustomJSONEncoder to handle Decimal and other special types."""
    def render(self, content: Any) -> bytes:
        return json.dumps(
            content,
            cls=CustomJSONEncoder,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
        ).encode("utf-8")

app = FastAPI(title="FinVerse Chatbot API", 
            default_response_class=CustomJSONResponse)
logger = logging.getLogger(__name__)

# Mount static files
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Add route for the root path to serve index.html
from fastapi.responses import FileResponse

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(static_dir, "index.html"))

# Initialize services
db = get_db()
db_service = DatabaseService(db)
rag_service = RAGService()
query_orchestrator = QueryOrchestrator(chat_history_service=ChatHistoryService())
chat_history_service = ChatHistoryService()
product_comparison_service = ProductComparisonService(db_service)
product_chat_service = ProductChatService(db_service, rag_service, chat_history_service)

app.include_router(
    create_router(
        db_service=db_service,
        rag_service=rag_service,
        query_orchestrator=query_orchestrator,
        chat_history_service=chat_history_service,
        product_comparison_service=product_comparison_service,
        product_chat_service=product_chat_service,
    )
)
