
from fastapi import APIRouter, Header, Depends
from schemas.chat import ChatRequest
from schemas.response import APIResponse
from repositories.chat_repo import ChatRepository
from repositories.mongo_product_repo import MongoProductRepository
from core.orchestrator import ChatOrchestrator
from core.db_client import get_chat_db
from core.mongo_client import get_mongo_collection
from core.llm_client import GeminiClient
from core.embedding_client import GeminiEmbeddingClient

router = APIRouter()

@router.post("")
def chat(
    payload: ChatRequest,
    x_user_id: str = Header(...),
    chat_db=Depends(get_chat_db),
    # product_db=Depends(get_product_db)
):
    chat_repo = ChatRepository(chat_db)
    mongo_collection = get_mongo_collection()
    embedding_client = GeminiEmbeddingClient()
    product_repo = MongoProductRepository(mongo_collection, embedding_client)
    orchestrator = ChatOrchestrator(chat_repo, product_repo)
    reply = orchestrator.handle_chat(
        session_id=payload.sessionId,
        user_id=x_user_id,
        message=payload.message
    )
    return APIResponse.success({"reply": reply})
