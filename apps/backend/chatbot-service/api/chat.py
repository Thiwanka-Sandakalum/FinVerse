
from fastapi import APIRouter, Header, Depends
from schemas.chat import ChatRequest
from schemas.response import APIResponse
from repositories.chat_repo import ChatRepository
from repositories.product_repo import ProductRepository
from services.yahoo_finance import YahooFinanceService
from core.orchestrator import ChatOrchestrator
from core.db_client import get_chat_db, get_product_db

router = APIRouter()

@router.post("")
def chat(
    payload: ChatRequest,
    x_user_id: str = Header(...),
    chat_db=Depends(get_chat_db),
    product_db=Depends(get_product_db)
):
    chat_repo = ChatRepository(chat_db)
    product_repo = ProductRepository(product_db)
    finance = YahooFinanceService()
    orchestrator = ChatOrchestrator(chat_repo, product_repo, finance)
    reply = orchestrator.handle_chat(
        session_id=payload.sessionId,
        user_id=x_user_id,
        message=payload.message
    )
    return APIResponse.success({"reply": reply})
