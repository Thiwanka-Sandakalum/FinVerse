from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
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
from src.models.api_models import (
    ChatRequest, ChatResponse, IngestResponse, Message,
    ProductChatRequest, ProductComparisonRequest, ProductComparisonResponse
)
from src.utils.auth_utils import get_user_id_from_request, get_current_user

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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = get_db()
db_service = DatabaseService(db)
rag_service = RAGService()
query_orchestrator = QueryOrchestrator(chat_history_service=ChatHistoryService())
chat_history_service = ChatHistoryService()
product_comparison_service = ProductComparisonService(db_service)
product_chat_service = ProductChatService(db_service, rag_service, chat_history_service)

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, request_obj: Request):
    try:
        user_id = get_user_id_from_request(request_obj)
        
        # Process query using the orchestrator
        answer, sources, query_type, conversation_id, history = await query_orchestrator.process_query(
            request.query, 
            conversation_id=request.conversation_id,
            include_history=request.include_history if request.include_history is not None else True,
            user_id=user_id
        )
        
        # Ensure we have a valid conversation_id
        final_conversation_id = conversation_id or request.conversation_id or ""
        
        # Format response with query type (convert enum to string)
        return ChatResponse(
            answer=answer,
            sources=sources,
            conversation_id=final_conversation_id,
            query_type=query_type.value,
            history=history
        )
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/product-chat", response_model=ChatResponse)
async def product_chat(request: ProductChatRequest, request_obj: Request):
    """
    Chat about a specific product identified by its ID.
    All responses will be contextualized only to that product.
    """
    try:
        user_id = get_user_id_from_request(request_obj)
        
        # Process query about the specific product
        answer, sources, conversation_id, history = await product_chat_service.process_product_query(
            query=request.query,
            product_id=request.product_id,
            conversation_id=request.conversation_id,
            include_history=request.include_history if request.include_history is not None else True,
            user_id=user_id
        )
        
        # Ensure we have a valid conversation_id
        final_conversation_id = conversation_id or request.conversation_id or ""
        
        # Format response
        return ChatResponse(
            answer=answer,
            sources=sources,
            conversation_id=final_conversation_id,
            query_type="product_specific",
            history=history
        )
    except Exception as e:
        logger.error(f"Error in product chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare-products", response_model=ProductComparisonResponse)
async def compare_products(request: ProductComparisonRequest, request_obj: Request):
    """
    Compare multiple financial products by their IDs.
    Returns a structured comparison highlighting differences across key attributes.
    """
    try:
        if not request.product_ids or len(request.product_ids) < 2:
            raise HTTPException(
                status_code=400, 
                detail="Please provide at least 2 product IDs for comparison"
            )
        
        # Get user ID from request if available
        user_id = get_user_id_from_request(request_obj)
        
        # Ensure we have a valid conversation_id (empty string as fallback)
        conversation_id = request.conversation_id or ""
        
        # Generate the comparison using the orchestrator
        # This will handle both the comparison and saving to chat history
        summary = await query_orchestrator.handle_product_comparison(
            product_ids=request.product_ids, 
            conversation_id=conversation_id,
            user_id=user_id
        )
        
        # Generate the basic comparison structure for the response
        comparison = product_comparison_service.compare_products(request.product_ids)
        
        # Format response
        return ProductComparisonResponse(
            summary=summary,
            comparison=comparison,
            products=comparison.get("products", []),
            conversation_id=conversation_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in product comparison endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest", response_model=IngestResponse)
async def ingest_data():
    try:
        db = get_db()
        db_service = DatabaseService(db)
        products = db_service.get_all_products()
        
        # Products are already in dictionary format from PrismaClient
        # Ingest products into vector store
        rag_service.ingest_products(products)
        
        return IngestResponse(
            status="success",
            message="Successfully ingested products into vector store",
            ingested_count=len(products)
        )
    except Exception as e:
        logger.error(f"Error in ingest endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products/{product_id}")
def get_product(product_id: str):
    db = get_db()
    db_service = DatabaseService(db)
    product = db_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/products/type/{type_name}")
def get_products_by_type(type_name: str):
    """Get products by their type name."""
    db = get_db()
    db_service = DatabaseService(db)
    products = db_service.get_products_by_type(type_name)
    return products

@app.get("/institutions")
def get_institutions():
    db = get_db()
    db_service = DatabaseService(db)
    return db_service.get_institutions()

@app.get("/stats")
def get_query_stats():
    """
    Get statistics about processed queries.
    """
    try:
        stats = query_orchestrator.get_query_stats()
        return {
            "status": "success",
            "stats": stats
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations")
def get_conversations(request: Request, limit: int = 100):
    """
    Get a list of chat conversations for the current user.
    """
    try:
        user_id = get_user_id_from_request(request)
        conversations = chat_history_service.get_user_conversations(user_id, limit) if user_id else chat_history_service.get_all_conversations(limit)
        return {
            "status": "success",
            "conversations": conversations
        }
    except Exception as e:
        logger.error(f"Error getting conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations/{conversation_id}/history")
def get_conversation_history(conversation_id: str, limit: int = 20):
    """
    Get message history for a specific conversation.
    """
    try:
        messages = chat_history_service.get_conversation_history(conversation_id, limit)
        return {
            "status": "success",
            "conversation_id": conversation_id,
            "messages": messages
        }
    except Exception as e:
        logger.error(f"Error getting conversation history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: str):
    """
    Delete a conversation and all its messages.
    """
    try:
        success = chat_history_service.delete_conversation(conversation_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")
        
        return {
            "status": "success",
            "message": f"Conversation {conversation_id} deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/conversations/cleanup")
def cleanup_old_conversations(days: int = 30):
    """
    Delete conversations older than specified days.
    """
    try:
        deleted_count = chat_history_service.cleanup_old_conversations(days)
        return {
            "status": "success",
            "message": f"Deleted {deleted_count} old conversations",
            "deleted_count": deleted_count
        }
    except Exception as e:
        logger.error(f"Error cleaning up conversations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Authentication-related endpoints

@app.get("/auth/me")
async def get_current_user_info(user_data: Dict[str, Any] = Depends(get_current_user)):
    """
    Get information about the currently authenticated user.
    Requires a valid JWT token in the Authorization header.
    """
    return {
        "status": "success",
        "user_id": user_data["user_id"],
        "is_authenticated": True
    }