
from fastapi import APIRouter, Depends
from schemas.chat import CompareRequest
from schemas.response import APIResponse
from services.comparison import ComparisonService
from core.db_client import get_product_db

router = APIRouter()

@router.post("")
def compare(payload: CompareRequest, db=Depends(get_product_db)):
    service = ComparisonService(db)
    result = service.compare(payload.productIds)
    return APIResponse.success(result)
