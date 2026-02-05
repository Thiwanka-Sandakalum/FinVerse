
from fastapi import APIRouter, Header
from schemas.chat import ProductChatRequest
from schemas.response import APIResponse
from repositories.mongo_product_repo import MongoProductRepository
from core.llm_client import GeminiClient
from core.mongo_client import get_mongo_collection
import json

router = APIRouter()
llm = GeminiClient()

def serialize_product(product):
    if not product:
        return {}
    return {
        "id": product.get("_id", ""),
        "name": product.get("name", ""),
        "categoryId": product.get("categoryId", None),
        "details": product.get("details", {}),
        "isFeatured": product.get("isFeatured", None),
        "isActive": product.get("isActive", None),
        "createdAt": str(product.get("createdAt", "")),
        "updatedAt": str(product.get("updatedAt", ""))
    }

def load_prompt_template(path):
    with open(path, 'r') as f:
        return json.load(f)

@router.post("")
def product_chat(
    payload: ProductChatRequest,
    x_user_id: str = Header(...),
):
    mongo_collection = get_mongo_collection()
    product_repo = MongoProductRepository(mongo_collection, None)
    product = product_repo.get_relevant_products(filter={"_id": payload.productId}, limit=1)
    product_details = serialize_product(product[0] if product else None)

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
