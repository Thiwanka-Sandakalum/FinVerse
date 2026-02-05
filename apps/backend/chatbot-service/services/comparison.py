

import json
from repositories.mongo_product_repo import MongoProductRepository
from core.llm_client import GeminiClient

class ComparisonService:
    def __init__(self, mongo_collection):
        self.products = MongoProductRepository(mongo_collection, None)
        self.llm = GeminiClient()

    def serialize_product(self, product):
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

    def load_prompt_template(self, path):
        with open(path, 'r') as f:
            return json.load(f)

    def compare(self, product_ids, user_prompt="Compare these products"):
        products = self.products.get_relevant_products(filter={"_id": {"$in": product_ids}}, limit=len(product_ids))
        products_details = [self.serialize_product(p) for p in products]

        prompt_template = self.load_prompt_template("prompts/compare_products.json")
        system_prompt = prompt_template["system"]
        context = prompt_template["context"].format(products_details=json.dumps(products_details, ensure_ascii=False, indent=2))

        summary = self.llm.generate(
            user_prompt=user_prompt,
            context=context,
            system_prompt=system_prompt
        )
        return {
            "products": products_details,
            "summary": summary
        }
