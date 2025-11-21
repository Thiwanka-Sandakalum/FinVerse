"""
Service for product-specific chat functionality.
"""

import logging
import uuid
from typing import Dict, Any, List, Tuple, Optional
import traceback

from src.services.database_service import DatabaseService
from src.services.rag_service import RAGService
from src.services.chat_history_service import ChatHistoryService
from src.models.api_models import Message, Source

logger = logging.getLogger(__name__)

class ProductChatService:
    """Service for handling product-specific conversations."""
    
    def __init__(self, db_service: DatabaseService, rag_service: RAGService, chat_history_service: ChatHistoryService):
        """Initialize the product chat service."""
        self.db_service = db_service
        self.rag_service = rag_service
        self.chat_history_service = chat_history_service
    
    async def process_product_query(
        self, 
        query: str, 
        product_id: str,
        conversation_id: Optional[str] = None,
        include_history: bool = True,
        user_id: Optional[str] = None
    ) -> Tuple[str, List[Source], str, Optional[List[Message]]]:
        """
        Process a query specific to a product.
        
        Args:
            query: The user's query
            product_id: The ID of the product to focus on
            conversation_id: Optional conversation ID for continuing a conversation
            include_history: Whether to include conversation history in the context
            user_id: Optional user ID for tracking who is asking the question
            
        Returns:
            Tuple of (answer, sources, conversation_id, history)
        """
        try:
            # Generate a conversation ID if none provided
            if not conversation_id:
                conversation_id = str(uuid.uuid4())
            
            # Get product details to use as context
            product = self.db_service.get_product_by_id(product_id)
            if not product:
                return (f"Sorry, I couldn't find product with ID {product_id}.", [], conversation_id, None)
            
            # Get conversation history if requested
            history = None
            conversation_context = ""
            
            if include_history:
                history = self.chat_history_service.get_conversation_history(conversation_id)
                if history:
                    conversation_context = self.chat_history_service.get_conversation_history_as_string(conversation_id)
                    logger.info(f"Including conversation context: {len(conversation_context)} chars")
            
            # Store the user's message in history
            self.chat_history_service.add_message(conversation_id, query, "user", user_id)
            
            # Create the prompt with product information as context
            product_context = self._get_product_context(product)
            
            # Combine the product context with conversation context
            context = f"{product_context}\n\n{conversation_context}" if conversation_context else product_context
            
            # Get answer using RAG
            answer = await self.rag_service.generate_response(query, context)
            
            # Create a source for the product
            source = Source(
                product_id=product_id,
                product_name=str(product.get("name", "Unknown Product")),
                text=str(product.get("description", "No description"))
            )
            
            # Store the assistant's response in history
            self.chat_history_service.add_message(conversation_id, answer, "assistant", user_id)
            
            # Return the answer, sources, conversation ID, and history
            return answer, [source], conversation_id, history
            
        except Exception as e:
            logger.error(f"Error processing product-specific query: {str(e)}")
            logger.error(traceback.format_exc())
            return ("I'm sorry, but an error occurred while processing your query about this product. Please try again.", 
                   [], conversation_id or str(uuid.uuid4()), None)
    
    def _get_product_context(self, product: Dict[str, Any]) -> str:
        """Generate a context string from product data."""
        # Extract product details for context
        product_name = str(product.get("name", "Unknown Product"))
        
        product_type_dict = product.get("type", {})
        product_type = str(product_type_dict.get("name", "Unknown Type") if isinstance(product_type_dict, dict) else "Unknown Type")
        
        product_institution_dict = product.get("institution", {})
        product_institution = str(product_institution_dict.get("name", "Unknown Institution") if isinstance(product_institution_dict, dict) else "Unknown Institution")
        
        # Format product attributes as a context string
        attributes: List[str] = []
        for key, value in product.items():
            if key not in ["id", "name", "typeId", "institutionId", "type", "institution"]:
                if isinstance(value, dict) or isinstance(value, list):
                    continue
                attributes.append(f"{key}: {value}")
        
        attributes_str = "\n".join(attributes)
        
        # Create the context string
        context = f"""
You are now providing information specifically about the following financial product:
Product Name: {product_name}
Product Type: {product_type}
Institution: {product_institution}

Product Details:
{attributes_str}

Please answer questions only about this specific product based on the information provided above.
"""
        return context