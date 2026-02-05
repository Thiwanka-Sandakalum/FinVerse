

from fastapi import APIRouter
from schemas.chat import CompareRequest
from schemas.response import APIResponse
from services.comparison import ComparisonService
from core.mongo_client import get_mongo_collection

router = APIRouter()

@router.post("")
def compare(payload: CompareRequest):
    mongo_collection = get_mongo_collection()
    service = ComparisonService(mongo_collection)
    user_prompt = getattr(payload, 'message', None) or "Compare these products"
    result = service.compare(payload.productIds, user_prompt=user_prompt)
    return APIResponse.success(result)
