from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import logging
import os
from fastapi.responses import JSONResponse, FileResponse
from src.utils.json_utils import CustomJSONEncoder, process_value
from src.utils.paths import path_manager, ensure_directories
import json

from src.services.database_service import get_db, DatabaseService
from src.services.rag_service import RAGService
from src.services.query_orchestrator import QueryOrchestrator
from src.services.chat_history_service import ChatHistoryService
from src.services.product_comparison_service import ProductComparisonService
from src.services.product_chat_service import ProductChatService
from src.models.api_models import (
    ChatRequest, ChatResponse, IngestResponse, Message,
    ProductComparisonRequest, ProductComparisonResponse,
    ProductChatRequest, ProductChatResponse,
    ComparisonChatRequest, ComparisonChatResponse
)

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

# Ensure directories exist
ensure_directories()

# Mount static files using cross-platform paths
static_dir = path_manager.static_dir_str
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Add route for the root path to serve index.html
@app.get("/")
async def read_root():
    return FileResponse(path_manager.index_html_str)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
rag_service = RAGService()
query_orchestrator = QueryOrchestrator()
chat_history_service = ChatHistoryService()
product_comparison_service = ProductComparisonService()
product_chat_service = ProductChatService()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Process query using the orchestrator
        answer, sources, query_type, conversation_id, history = await query_orchestrator.process_query(
            request.query, 
            conversation_id=request.conversation_id,
            include_history=request.include_history if request.include_history is not None else True
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
def get_conversations(limit: int = 100):
    """
    Get a list of all chat conversations.
    """
    try:
        conversations = chat_history_service.get_all_conversations(limit)
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

# Product Comparison Routes
@app.post("/compare", response_model=ProductComparisonResponse)
async def compare_products(request: ProductComparisonRequest):
    """
    Compare multiple financial products and return structured comparison data.
    
    This endpoint accepts a list of product IDs and returns a detailed comparison
    including best options for different criteria, summary statistics, and recommendations.
    """
    try:
        if len(request.product_ids) < 2:
            raise HTTPException(status_code=400, detail="At least 2 products are required for comparison")
        
        if len(request.product_ids) > 10:
            raise HTTPException(status_code=400, detail="Maximum 10 products can be compared at once")
        
        # Perform comparison
        comparison, comparison_id = await product_comparison_service.compare_products(request)
        
        return ProductComparisonResponse(
            status="success",
            comparison=comparison,
            comparison_id=comparison_id
        )
    except ValueError as ve:
        logger.error(f"Validation error in product comparison: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error comparing products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare/chat", response_model=ComparisonChatResponse)
async def comparison_chat(request: ComparisonChatRequest):
    """
    Chat about a previous product comparison.
    
    This endpoint allows users to ask questions about a comparison they've already made,
    getting personalized recommendations and detailed explanations.
    """
    try:
        answer, comparison_context, recommended_products, sources, conversation_id, history = await product_chat_service.process_comparison_chat(
            query=request.query,
            comparison_id=request.comparison_id,
            conversation_id=request.conversation_id,
            include_history=request.include_history if request.include_history is not None else True
        )
        
        return ComparisonChatResponse(
            answer=answer,
            comparison_context=comparison_context,
            recommended_products=recommended_products,
            sources=sources,
            conversation_id=conversation_id,
            history=history
        )
    except ValueError as ve:
        logger.error(f"Validation error in comparison chat: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error in comparison chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Product-Specific Chat Routes
@app.post("/product/{product_id}/chat", response_model=ProductChatResponse)
async def product_chat(product_id: str, request: ProductChatRequest):
    """
    Chat about a specific financial product.
    
    This endpoint provides focused conversations about individual products,
    including detailed product information, comparisons with similar products,
    and personalized recommendations.
    """
    try:
        answer, product_context, related_products, sources, query_type, conversation_id, history = await product_chat_service.process_product_chat(
            query=request.query,
            product_id=product_id,
            conversation_id=request.conversation_id,
            include_history=request.include_history if request.include_history is not None else True,
            include_comparison=request.include_comparison if request.include_comparison is not None else False
        )
        
        return ProductChatResponse(
            answer=answer,
            product_context=product_context,
            related_products=related_products,
            sources=sources,
            conversation_id=conversation_id,
            query_type=query_type.value,
            history=history
        )
    except ValueError as ve:
        logger.error(f"Validation error in product chat: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error in product chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Enhanced Product Routes
@app.get("/products/{product_id}/similar")
def get_similar_products(product_id: str, limit: int = 5):
    """
    Get products similar to the specified product.
    
    Returns products of the same type, useful for comparison and recommendations.
    """
    try:
        # Get the base product
        db = get_db()
        db_service = DatabaseService(db)
        product = db_service.get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product_type = product.get('type', '')
        if product_type:
            similar_products = db_service.get_products_by_type(product_type)
            # Exclude the current product
            similar_products = [p for p in similar_products if p.get('id') != product_id]
            # Limit results
            similar_products = similar_products[:limit]
        else:
            similar_products = []
        
        return {
            "status": "success",
            "base_product": product,
            "similar_products": similar_products,
            "total_found": len(similar_products)
        }
    except Exception as e:
        logger.error(f"Error getting similar products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products/search")
def search_products(
    query: Optional[str] = None,
    product_type: Optional[str] = None,
    institution: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    max_interest_rate: Optional[float] = None,
    limit: int = 20
):
    """
    Search and filter products based on various criteria.
    
    Supports text search, filtering by type, institution, loan amounts, and interest rates.
    """
    try:
        db = get_db()
        db_service = DatabaseService(db)
        
        # Get all products first
        all_products = db_service.get_all_products()
        filtered_products = all_products
        
        # Apply filters
        if product_type:
            filtered_products = [p for p in filtered_products if p.get('type', '').lower() == product_type.lower()]
        
        if institution:
            filtered_products = [p for p in filtered_products if institution.lower() in p.get('institution', '').lower()]
        
        if min_amount is not None:
            filtered_products = [p for p in filtered_products 
                               if p.get('loan_amount_min') and float(p['loan_amount_min']) >= min_amount]
        
        if max_amount is not None:
            filtered_products = [p for p in filtered_products 
                               if p.get('loan_amount_max') and float(p['loan_amount_max']) <= max_amount]
        
        if max_interest_rate is not None:
            filtered_products = [p for p in filtered_products 
                               if p.get('interest_rate') and float(p['interest_rate']) <= max_interest_rate]
        
        # Text search in name and description
        if query:
            query_lower = query.lower()
            filtered_products = [p for p in filtered_products 
                               if query_lower in p.get('name', '').lower() or 
                                  query_lower in p.get('description', '').lower()]
        
        # Limit results
        filtered_products = filtered_products[:limit]
        
        return {
            "status": "success",
            "products": filtered_products,
            "total_found": len(filtered_products),
            "filters_applied": {
                "query": query,
                "product_type": product_type,
                "institution": institution,
                "min_amount": min_amount,
                "max_amount": max_amount,
                "max_interest_rate": max_interest_rate
            }
        }
    except Exception as e:
        logger.error(f"Error searching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/comparison/{comparison_id}")
def get_comparison(comparison_id: str):
    """
    Retrieve a cached product comparison by ID.
    
    Useful for accessing previous comparisons for follow-up questions.
    """
    try:
        comparison = product_comparison_service.get_cached_comparison(comparison_id)
        if not comparison:
            raise HTTPException(status_code=404, detail="Comparison not found or expired")
        
        return {
            "status": "success",
            "comparison": comparison,
            "comparison_id": comparison_id
        }
    except Exception as e:
        logger.error(f"Error retrieving comparison: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
