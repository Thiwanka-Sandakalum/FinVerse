from src.services.database_service import get_db, DatabaseService
from src.services.rag_service import RAGService

def index_products():
    print("Starting product indexing...")
    db = get_db()
    rag_service = RAGService()
    db_service = DatabaseService(db)
    
    try:
        # Get all products with their relationships
        products = db_service.get_all_products()
        
        # Products are already in dictionary format from PrismaClient
        # Ingest products into vector store
        rag_service.ingest_products(products)
        print(f"Successfully indexed {len(products)} products")
        
    except Exception as e:
        print(f"Error during indexing: {e}")

if __name__ == "__main__":
    index_products()
