
from fastapi import APIRouter, Depends
from schemas.chat import CompareRequest
from schemas.response import APIResponse
from services.comparison import ComparisonService
from core.db_client import get_product_db

router = APIRouter()

@router.post("")
def compare(payload: CompareRequest, db=Depends(get_product_db)):
    service = ComparisonService(db)
    # Pass user prompt if available, else default
    user_prompt = getattr(payload, 'message', None) or "Compare these products"
    result = service.compare(payload.productIds, user_prompt=user_prompt)
    return APIResponse.success(result)
