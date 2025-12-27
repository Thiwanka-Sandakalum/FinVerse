
from repositories.product_repo import ProductRepository
from core.llm_client import GeminiClient

class ComparisonService:
    def __init__(self, db):
        self.products = ProductRepository(db)
        self.llm = GeminiClient()

    def compare(self, product_ids):
        products = [self.products.get_by_id(pid) for pid in product_ids]
        summary = self.llm.generate(
            user_prompt="Compare these products",
            context=str(products)
        )
        return {
            "products": products,
            "summary": summary
        }
