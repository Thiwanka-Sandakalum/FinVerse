from fastapi import APIRouter, Header
from schemas.chat import ProductChatRequest
from schemas.response import APIResponse

from repositories.product_repo import ProductRepository
from core.llm_client import GeminiClient
from core.db_client import get_product_db
from fastapi import Depends


router = APIRouter()
llm = GeminiClient()

@router.post("")
def product_chat(
    payload: ProductChatRequest,
    x_user_id: str = Header(...),
    db=Depends(get_product_db)
):
    products = ProductRepository(db)
    product = products.get_by_id(payload.productId)

    context = f"Product: {product}"

    reply = llm.generate(
        user_prompt=payload.message,
        context=context
    )

    return APIResponse.success({"reply": reply})
