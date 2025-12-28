from sqlalchemy import text
from sqlalchemy.orm import Session
from models.product import Product

class ProductRepository:
    def get_relevant_products(self, limit: int = 3):
        # Simple filter: get top N products (customize as needed)
        return self.db.query(Product).filter(Product.isActive == True).limit(limit).all()

    def get_by_sql_where(self, where_clause: str, limit: int = 5):
        # WARNING: This is a simplified and not SQL-injection safe example. In production, use SQLAlchemy text() with params.
            clean_where = where_clause.strip()
            if clean_where.lower().startswith('where '):
                clean_where = clean_where[6:].strip()
            query = f"SELECT * FROM products WHERE {clean_where} LIMIT {limit}"
            result = self.db.execute(text(query))
            return [Product(**dict(row)) for row in result.mappings()]
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, product_id: str) -> Product:
        return self.db.query(Product).filter(Product.id == product_id).first()