from typing import Dict, Any, List, Optional
from src.services.prisma_client import PrismaClient

# Create a global instance of the PrismaClient
prisma = PrismaClient()

def get_db():
    """Get a database connection."""
    return prisma

class DatabaseService:
    def __init__(self, db):
        """Initialize the DatabaseService with a PrismaClient instance."""
        self.db = db
    
    def get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products with their relationships."""
        return self.db.get_all_products()
    
    def get_institutions(self) -> List[Dict[str, Any]]:
        """Get all financial institutions."""
        return self.db.get_institutions()
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific product by ID."""
        return self.db.get_product_by_id(product_id)
    
    def get_products_by_type(self, type_name: str) -> List[Dict[str, Any]]:
        """Get products by their type name."""
        return self.db.get_products_by_type(type_name)
