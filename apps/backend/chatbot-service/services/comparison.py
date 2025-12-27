

import json
from repositories.product_repo import ProductRepository
from core.llm_client import GeminiClient

class ComparisonService:
    def __init__(self, db):
        self.products = ProductRepository(db)
        self.llm = GeminiClient()

    def serialize_product(self, product):
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

    def load_prompt_template(self, path):
        import json
        with open(path, 'r') as f:
            return json.load(f)

    def compare(self, product_ids, user_prompt="Compare these products"):
        products = [self.products.get_by_id(pid) for pid in product_ids]
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
