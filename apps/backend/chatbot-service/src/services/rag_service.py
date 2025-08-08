import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.schema import Document
from typing import List, Dict, Any
from src.config.settings import Settings
from src.utils.json_utils import process_value
from src.utils.paths import path_manager

settings = Settings()
genai.configure(api_key=settings.GOOGLE_API_KEY)

class RAGService:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.vector_store = None
        self.initialize_vector_store()
    
    def initialize_vector_store(self):
        """Initialize or load the vector store."""
        # Use cross-platform path management
        persist_directory = path_manager.vectordb_dir_str
        path_manager.ensure_data_directories()  # Ensure directory exists
        
        self.vector_store = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embeddings
        )
    
    def _create_document_from_product(self, product: Dict[str, Any]) -> str:
        """Create a document string from a product dictionary."""
        # Extract details with safe handling for missing values
        interest_rate = process_value(product.get('interest_rate', 'N/A'))
        loan_min = process_value(product.get('loan_amount_min', 'N/A'))
        loan_max = process_value(product.get('loan_amount_max', 'N/A'))
        term_min = process_value(product.get('term_min', 'N/A'))
        term_max = process_value(product.get('term_max', 'N/A'))
        requirements = process_value(product.get('requirements', []))
        features = process_value(product.get('features', []))
        apr = process_value(product.get('annual_percentage_rate', 'N/A'))
        origination_fee = process_value(product.get('origination_fee', 'N/A'))
        
        # Format lists properly with error handling
        if isinstance(requirements, list):
            requirements_str = ", ".join(str(req) for req in requirements if req)
        else:
            requirements_str = str(requirements) if requirements else "None specified"
            
        if isinstance(features, list):
            features_str = ", ".join(str(feat) for feat in features if feat)
        else:
            features_str = str(features) if features else "None specified"
        
        # Build document with clear labels and safe values
        doc_text = f"""{product.get('name', 'Unnamed Product')}: This {product.get('type', 'product')} is offered by {product.get('institution', 'Unknown Institution')}.
        Interest Rate: {interest_rate}% 
        APR (Annual Percentage Rate): {apr}%
        Loan Amount Range: {loan_min} to {loan_max} LKR
        Term Range: {term_min} to {term_max} months
        Origination Fee: {origination_fee}%
        Features: {features_str}
        Requirements: {requirements_str}
        Description: {product.get('description', 'No description available')}"""
        return doc_text
    
    def ingest_products(self, products: List[Dict[str, Any]]) -> None:
        """Convert products to documents and add to vector store."""
        documents = []
        for product in products:
            doc_text = self._create_document_from_product(product)
            doc = Document(
                page_content=doc_text,
                metadata={
                    "product_id": product["id"],
                    "name": product["name"],
                    "institution": product["institution"],
                    "type": product["type"]
                }
            )
            documents.append(doc)
        
        chunks = self.text_splitter.split_documents(documents)
        self.vector_store.add_documents(chunks)
    
    def retrieve_context(self, query: str, k: int = 3) -> List[Document]:
        """Retrieve relevant documents for a query."""
        return self.vector_store.similarity_search(query, k=k)
    
    def format_context(self, documents: List[Document]) -> str:
        """Format retrieved documents into a context string."""
        if not documents:
            return "\nNo relevant information found.\n"
            
        context = "\nContext Information:\n"
        
        # Group documents by product name to avoid duplicates
        product_groups = {}
        for doc in documents:
            product_name = doc.metadata.get("name", "Unknown Product")
            if product_name not in product_groups:
                product_groups[product_name] = []
            product_groups[product_name].append(doc)
        
        # Format each product's information
        for i, (product_name, docs) in enumerate(product_groups.items(), 1):
            # Get institution name from the first document in each group
            institution = docs[0].metadata.get("institution", "Unknown Institution")
            context += f"{i}. {product_name} (from {institution}):\n"
            
            # Concatenate unique content from documents about this product
            content_set = set()
            for doc in docs:
                # Clean up content and add to set if not already included
                clean_content = doc.page_content.strip().replace('\n        ', ' ').replace('  ', ' ')
                content_set.add(clean_content)
            
            # Add all unique content pieces
            for content in content_set:
                context += f"   {content}\n\n"
        
        return context
    
    async def generate_response(self, query: str, context: str) -> str:
        """Generate a response using Gemini Pro."""
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""You are a helpful financial advisor assistant. Use the following context to answer the user's question.
        Provide detailed information about financial products when available, including:
        - Interest rates and APR
        - Loan amount ranges
        - Term lengths
        - Fees and penalties
        - Features and benefits
        - Requirements and eligibility criteria
        
        Always include specific numbers and details when they are available in the context.
        When information is marked as 'N/A' or is missing, explain that this information is not available 
        rather than making up values or skipping the field completely.
        
        Be thorough and provide all available information from the context in a structured format.
        Start with a brief overview, then organize details into clear categories with bullet points where appropriate.
        
        {context}
        
        User Question: {query}
        
        Answer: """
        
        response = await model.generate_content_async(prompt)
        return response.text
