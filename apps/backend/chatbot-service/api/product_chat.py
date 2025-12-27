from fastapi import APIRouter, Header, Depends
from schemas.chat import ProductChatRequest
from schemas.response import APIResponse
from repositories.product_repo import ProductRepository
from core.llm_client import GeminiClient
from core.db_client import get_product_db
import json

router = APIRouter()
llm = GeminiClient()

def serialize_product(product):
    if not product:
        return {}
    return {
        "id": product.id,
        "name": product.name,
        "categoryId": product.categoryId if hasattr(product, 'categoryId') else getattr(product, 'category_id', None),
        "details": product.details,
        "isFeatured": getattr(product, 'isFeatured', getattr(product, 'is_featured', None)),
        "isActive": getattr(product, 'isActive', getattr(product, 'is_active', None)),
        "createdAt": str(getattr(product, 'createdAt', getattr(product, 'created_at', ''))),
        "updatedAt": str(getattr(product, 'updatedAt', getattr(product, 'updated_at', '')))
    }

def load_prompt_template(path):
    with open(path, 'r') as f:
        return json.load(f)

@router.post("")
def product_chat(
    payload: ProductChatRequest,
    x_user_id: str = Header(...),
    db=Depends(get_product_db)
):
    products = ProductRepository(db)
    product = products.get_by_id(payload.productId)
    product_details = serialize_product(product)

    prompt_template = load_prompt_template("prompts/product_chat.json")
    system_prompt = prompt_template["system"]
    user_prompt = payload.message
    context = prompt_template["context"].format(product_details=json.dumps(product_details, ensure_ascii=False, indent=2))

    reply = llm.generate(
        user_prompt=user_prompt,
        context=context,
        system_prompt=system_prompt
    )

    return APIResponse.success({"reply": reply})
