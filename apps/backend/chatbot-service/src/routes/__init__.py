from fastapi import APIRouter, Request, HTTPException
from typing import List, Dict, Any, Optional
import logging
import os

from src.models.api_models import (
    ChatRequest, ChatResponse, IngestResponse,
    ProductChatRequest, ProductComparisonRequest, ProductComparisonResponse
)
from src.utils.auth_utils import get_user_id_from_request

logger = logging.getLogger(__name__)


def create_router(
    db_service,
    rag_service,
    query_orchestrator,
    chat_history_service,
    product_comparison_service,
    product_chat_service,
):
    """Create and return an APIRouter wired with the application's route handlers.

    All heavy-lifting logic remains in the service layer; the router simply calls into
    the provided service instances. This keeps the route layer separate from app
    initialization.
    """
    router = APIRouter()


    @router.post("/chat", response_model=ChatResponse)
    async def chat(request: ChatRequest, request_obj: Request):
        try:
            user_id = get_user_id_from_request(request_obj)

            answer, sources, query_type, conversation_id, history = await query_orchestrator.process_query(
                request.query,
                conversation_id=request.conversation_id,
                include_history=request.include_history if request.include_history is not None else True,
                user_id=user_id,
            )

            final_conversation_id = conversation_id or request.conversation_id or ""

            return ChatResponse(
                answer=answer,
                sources=sources,
                conversation_id=final_conversation_id,
                query_type=query_type.value if hasattr(query_type, "value") else str(query_type),
                history=history,
            )
        except Exception as e:
            logger.error(f"Error in chat endpoint: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.post("/product-chat", response_model=ChatResponse)
    async def product_chat(request: ProductChatRequest, request_obj: Request):
        try:
            user_id = get_user_id_from_request(request_obj)

            answer, sources, conversation_id, history = await product_chat_service.process_product_query(
                query=request.query,
                product_id=request.product_id,
                conversation_id=request.conversation_id,
                include_history=request.include_history if request.include_history is not None else True,
                user_id=user_id,
            )

            final_conversation_id = conversation_id or request.conversation_id or ""

            return ChatResponse(
                answer=answer,
                sources=sources,
                conversation_id=final_conversation_id,
                query_type="product_specific",
                history=history,
            )
        except Exception as e:
            logger.error(f"Error in product chat endpoint: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.post("/compare-products", response_model=ProductComparisonResponse)
    async def compare_products(request: ProductComparisonRequest, request_obj: Request):
        try:
            if not request.product_ids or len(request.product_ids) < 2:
                raise HTTPException(status_code=400, detail="Please provide at least 2 product IDs for comparison")

            user_id = get_user_id_from_request(request_obj)
            conversation_id = request.conversation_id or ""

            summary = await query_orchestrator.handle_product_comparison(
                product_ids=request.product_ids,
                conversation_id=conversation_id,
                user_id=user_id,
            )

            comparison = product_comparison_service.compare_products(request.product_ids)

            return ProductComparisonResponse(
                summary=summary,
                comparison=comparison,
                products=comparison.get("products", []),
                conversation_id=conversation_id,
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error in product comparison endpoint: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.post("/ingest", response_model=IngestResponse)
    async def ingest_data():
        try:
            # Use the passed db_service and rag_service
            products = db_service.get_all_products()
            rag_service.ingest_products(products)

            return IngestResponse(status="success", message="Successfully ingested products into vector store", ingested_count=len(products))
        except Exception as e:
            logger.error(f"Error in ingest endpoint: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.get("/stats")
    def get_query_stats():
        try:
            stats = query_orchestrator.get_query_stats()
            return {"status": "success", "stats": stats}
        except Exception as e:
            logger.error(f"Error getting stats: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.get("/conversations")
    def get_conversations(request: Request, limit: int = 100):
        try:
            user_id = get_user_id_from_request(request)
            conversations = (
                chat_history_service.get_user_conversations(user_id, limit)
                if user_id
                else chat_history_service.get_all_conversations(limit)
            )
            return {"status": "success", "conversations": conversations}
        except Exception as e:
            logger.error(f"Error getting conversations: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.get("/conversations/{conversation_id}/history")
    def get_conversation_history(conversation_id: str, limit: int = 20):
        try:
            messages = chat_history_service.get_conversation_history(conversation_id, limit)
            return {"status": "success", "conversation_id": conversation_id, "messages": messages}
        except Exception as e:
            logger.error(f"Error getting conversation history: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.delete("/conversations/{conversation_id}")
    def delete_conversation(conversation_id: str):
        try:
            success = chat_history_service.delete_conversation(conversation_id)
            if not success:
                raise HTTPException(status_code=404, detail=f"Conversation {conversation_id} not found")
            return {"status": "success", "message": f"Conversation {conversation_id} deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting conversation: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))


    @router.post("/conversations/cleanup")
    def cleanup_old_conversations(days: int = 30):
        try:
            deleted_count = chat_history_service.cleanup_old_conversations(days)
            return {"status": "success", "message": f"Deleted {deleted_count} old conversations", "deleted_count": deleted_count}
        except Exception as e:
            logger.error(f"Error cleaning up conversations: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    return router
