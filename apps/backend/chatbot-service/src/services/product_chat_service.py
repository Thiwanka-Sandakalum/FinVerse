"""
Product-Specific Chat Service

This service handles chat functionality specifically focused on individual products,
including product-specific queries and comparison-based conversations.
"""

import logging
import uuid
from typing import List, Dict, Any, Optional, Tuple
from enum import Enum

from src.services.database_service import DatabaseService, get_db
from src.services.rag_service import RAGService
from src.services.sql_query_service import SQLQueryService
from src.services.product_comparison_service import ProductComparisonService
from src.services.chat_history_service import ChatHistoryService
from src.models.api_models import Source, Message, ProductComparison

logger = logging.getLogger(__name__)

class ProductQueryType(Enum):
    PRODUCT_SPECIFIC = "product_specific"
    COMPARISON_BASED = "comparison_based"  
    GENERAL = "general"

class ProductChatService:
    """Service for handling product-specific chat interactions."""
    
    def __init__(self):
        self.db_service = DatabaseService(get_db())
        self.rag_service = RAGService()
        self.sql_service = SQLQueryService()
        self.comparison_service = ProductComparisonService()
        self.chat_history = ChatHistoryService()
    
    async def process_product_chat(self, query: str, product_id: str, 
                                 conversation_id: Optional[str] = None,
                                 include_history: bool = True,
                                 include_comparison: bool = False) -> Tuple[str, Dict[str, Any], Optional[List[Dict[str, Any]]], 
                                                                          List[Source], ProductQueryType, str, Optional[List[Message]]]:
        """
        Process a chat query focused on a specific product.
        
        Returns:
            Tuple of (answer, product_context, related_products, sources, query_type, conversation_id, history)
        """
        try:
            # Get the specific product
            product = self.db_service.get_product_by_id(product_id)
            if not product:
                raise ValueError(f"Product with ID {product_id} not found")
            
            # Get or create conversation
            if not conversation_id:
                created_conv_id = self.chat_history.create_conversation(
                    f"Product Discussion: {product.get('name', 'Unknown Product')}"
                )
                if isinstance(created_conv_id, str):
                    conversation_id = created_conv_id
                else:
                    conversation_id = str(uuid.uuid4())  # Fallback
            
            # Ensure conversation_id is a string
            if not isinstance(conversation_id, str):
                conversation_id = str(uuid.uuid4())
            
            # Add user message to history
            self.chat_history.add_message(conversation_id, query, "user")
            
            # Get conversation history if requested
            history = None
            conversation_context = ""
            if include_history:
                messages = self.chat_history.get_conversation_history(conversation_id)
                # Convert internal Message objects to API Message objects
                history = [Message(text=msg.text, role=msg.role, timestamp=msg.timestamp) for msg in messages]
                if len(messages) > 1:  # More than just the current message
                    # Convert to dict format for context formatting
                    msg_dicts = [{"role": msg.role, "message": msg.text} for msg in messages[:-1]]
                    conversation_context = self._format_conversation_context(msg_dicts)
            
            # Classify the query type
            query_type = self._classify_product_query(query, product)
            
            # Find related products for context
            related_products = self._find_related_products(product, limit=3)
            
            # Build product-specific context
            product_context_str = self._build_product_context(product, related_products, include_comparison)
            
            # Enhanced query with product context
            enhanced_query = f"""
Product Focus: {product.get('name', '')} from {product.get('institution', '')}

Product Details:
{product_context_str}

{"Conversation History:" + chr(10) + conversation_context + chr(10) if conversation_context else ""}

User Question: {query}

Please provide a detailed answer focused on this specific product. Include specific numbers, features, and benefits from the product details above.
"""
            
            # Generate response using RAG
            if query_type == ProductQueryType.COMPARISON_BASED:
                answer = await self._handle_comparison_query(enhanced_query, product, related_products)
            else:
                # Use RAG service for general product questions
                relevant_docs = self.rag_service.retrieve_context(query)
                context = self.rag_service.format_context(relevant_docs)
                full_context = f"{product_context_str}\n\nAdditional Context:\n{context}"
                answer = await self.rag_service.generate_response(enhanced_query, full_context)
            
            # Create sources
            sources = [Source(
                name=product.get('name', 'Unknown'),
                institution=product.get('institution', 'Unknown Institution'),
                product_id=product_id
            )]
            
            # Add related product sources
            for related in (related_products or []):
                sources.append(Source(
                    name=related.get('name', 'Unknown'),
                    institution=related.get('institution', 'Unknown Institution'), 
                    product_id=related.get('id')
                ))
            
            # Add assistant response to history
            self.chat_history.add_message(conversation_id, answer, "assistant")
            
            # Update history if needed
            if include_history:
                messages = self.chat_history.get_conversation_history(conversation_id)
                history = [Message(text=msg.text, role=msg.role, timestamp=msg.timestamp) for msg in messages]
            
            return answer, product, related_products, sources, query_type, conversation_id, history
            
        except Exception as e:
            logger.error(f"Error processing product chat: {str(e)}")
            raise
    
    async def process_comparison_chat(self, query: str, comparison_id: str,
                                    conversation_id: Optional[str] = None,
                                    include_history: bool = True) -> Tuple[str, ProductComparison, Optional[List[str]], 
                                                                         List[Source], str, Optional[List[Message]]]:
        """
        Process a chat query based on a previous product comparison.
        
        Returns:
            Tuple of (answer, comparison_context, recommended_products, sources, conversation_id, history)
        """
        try:
            # Get the comparison context
            comparison = self.comparison_service.get_cached_comparison(comparison_id)
            if not comparison:
                raise ValueError(f"Comparison with ID {comparison_id} not found or expired")
            
            # Get or create conversation
            if not conversation_id:
                created_conv_id = self.chat_history.create_conversation(
                    f"Comparison Discussion: {len(comparison.products)} products"
                )
                if isinstance(created_conv_id, str):
                    conversation_id = created_conv_id
                else:
                    conversation_id = str(uuid.uuid4())  # Fallback
            
            # Ensure conversation_id is a string
            if not isinstance(conversation_id, str):
                conversation_id = str(uuid.uuid4())
            
            # Add user message to history
            self.chat_history.add_message(conversation_id, query, "user")
            
            # Get conversation history if requested
            history = None
            conversation_context = ""
            if include_history:
                messages = self.chat_history.get_conversation_history(conversation_id)
                # Convert internal Message objects to API Message objects
                history = [Message(text=msg.text, role=msg.role, timestamp=msg.timestamp) for msg in messages]
                if len(messages) > 1:
                    # Convert to dict format for context formatting
                    msg_dicts = [{"role": msg.role, "message": msg.text} for msg in messages[:-1]]
                    conversation_context = self._format_conversation_context(msg_dicts)
            
            # Build comparison context for the LLM
            comparison_context_str = self._build_comparison_context(comparison)
            
            # Enhanced query with comparison context
            enhanced_query = f"""
Product Comparison Context:
{comparison_context_str}

{"Conversation History:" + chr(10) + conversation_context + chr(10) if conversation_context else ""}

User Question: {query}

Based on the comparison above, provide a detailed answer. Reference specific products, their advantages/disadvantages, and make recommendations based on the comparison data.
"""
            
            # Generate response
            answer = await self.rag_service.generate_response(enhanced_query, "")
            
            # Generate product recommendations based on query
            recommended_products = self._generate_recommendations(query, comparison)
            
            # Create sources from compared products
            sources = []
            for product in comparison.products:
                sources.append(Source(
                    name=product.get('name', 'Unknown'),
                    institution=product.get('institution', 'Unknown Institution'),
                    product_id=product.get('id')
                ))
            
            # Add assistant response to history
            self.chat_history.add_message(conversation_id, answer, "assistant")
            
            # Update history if needed
            if include_history:
                messages = self.chat_history.get_conversation_history(conversation_id)
                history = [Message(text=msg.text, role=msg.role, timestamp=msg.timestamp) for msg in messages]
            
            return answer, comparison, recommended_products, sources, conversation_id, history
            
        except Exception as e:
            logger.error(f"Error processing comparison chat: {str(e)}")
            raise
    
    def _classify_product_query(self, query: str, product: Dict[str, Any]) -> ProductQueryType:
        """Classify the type of product query."""
        query_lower = query.lower()
        
        # Keywords that indicate comparison queries
        comparison_keywords = ['compare', 'vs', 'versus', 'better', 'difference', 'which', 'best', 'choose']
        
        if any(keyword in query_lower for keyword in comparison_keywords):
            return ProductQueryType.COMPARISON_BASED
        
        # Keywords that indicate product-specific queries
        product_keywords = ['rate', 'fee', 'term', 'requirement', 'eligibility', 'feature', 'benefit']
        product_name_words = product.get('name', '').lower().split()
        
        if any(keyword in query_lower for keyword in product_keywords) or \
           any(word in query_lower for word in product_name_words if len(word) > 3):
            return ProductQueryType.PRODUCT_SPECIFIC
        
        return ProductQueryType.GENERAL
    
    def _find_related_products(self, product: Dict[str, Any], limit: int = 3) -> List[Dict[str, Any]]:
        """Find products related to the given product."""
        try:
            # Get products of the same type
            product_type = product.get('type', '')
            if product_type:
                related = self.db_service.get_products_by_type(product_type)
                # Exclude the current product and limit results
                related = [p for p in related if p.get('id') != product.get('id')][:limit]
                return related
        except Exception as e:
            logger.warning(f"Error finding related products: {str(e)}")
        
        return []
    
    def _build_product_context(self, product: Dict[str, Any], 
                              related_products: Optional[List[Dict[str, Any]]] = None,
                              include_comparison: bool = False) -> str:
        """Build a comprehensive context string for the product."""
        context = f"""
Name: {product.get('name', 'Unknown')}
Institution: {product.get('institution', 'Unknown')}
Type: {product.get('type', 'Unknown')}
Description: {product.get('description', 'No description available')}
"""
        
        # Add financial details
        if product.get('interest_rate'):
            context += f"Interest Rate: {product['interest_rate']}%\n"
        
        if product.get('loan_amount_min') and product.get('loan_amount_max'):
            context += f"Loan Amount Range: Rs. {product['loan_amount_min']:,} - Rs. {product['loan_amount_max']:,}\n"
        elif product.get('loan_amount_max'):
            context += f"Maximum Loan Amount: Rs. {product['loan_amount_max']:,}\n"
        
        if product.get('term_min') and product.get('term_max'):
            context += f"Term Range: {product['term_min']} - {product['term_max']} months\n"
        
        if product.get('origination_fee'):
            context += f"Origination Fee: Rs. {product['origination_fee']:,}\n"
        
        if product.get('annual_percentage_rate'):
            context += f"Annual Percentage Rate: {product['annual_percentage_rate']}%\n"
        
        # Add features and requirements
        if product.get('features'):
            features = product['features']
            if isinstance(features, list):
                context += f"Features: {', '.join(features)}\n"
            else:
                context += f"Features: {features}\n"
        
        if product.get('requirements'):
            requirements = product['requirements'] 
            if isinstance(requirements, list):
                context += f"Requirements: {', '.join(requirements)}\n"
            else:
                context += f"Requirements: {requirements}\n"
        
        # Add related products if requested
        if include_comparison and related_products:
            context += "\nSimilar Products:\n"
            for related in related_products:
                context += f"- {related.get('name', 'Unknown')} from {related.get('institution', 'Unknown')}\n"
        
        return context
    
    def _build_comparison_context(self, comparison: ProductComparison) -> str:
        """Build a context string from a product comparison."""
        context = f"Comparison of {len(comparison.products)} products:\n\n"
        
        # Add products overview
        context += "Products:\n"
        for i, product in enumerate(comparison.products, 1):
            context += f"{i}. {product.get('name', 'Unknown')} from {product.get('institution', 'Unknown')}\n"
        
        context += "\nDetailed Comparison:\n"
        
        # Add comparison fields
        for field in comparison.comparison_fields:
            context += f"\n{field.field_label}:\n"
            for product_id, value in field.values.items():
                product_name = next(
                    (p.get('name', 'Unknown') for p in comparison.products if p.get('id') == product_id),
                    'Unknown Product'
                )
                best_indicator = " (BEST)" if field.best_option == product_id else ""
                context += f"  - {product_name}: {value}{best_indicator}\n"
            
            if field.notes:
                context += f"  Note: {field.notes}\n"
        
        # Add summary
        if comparison.summary.get('overall_best'):
            best = comparison.summary['overall_best']
            context += f"\nOverall Best Performer: {best.get('product_name', 'Unknown')} "
            context += f"(wins {best.get('wins', 0)} out of {best.get('total_criteria', 0)} criteria)\n"
        
        return context
    
    def _format_conversation_context(self, messages: List[Dict[str, Any]]) -> str:
        """Format conversation history for context."""
        context = []
        for msg in messages:
            role = "User" if msg.get('role') == 'user' else "Assistant"
            context.append(f"{role}: {msg.get('message', '')}")
        return "\n".join(context)
    
    async def _handle_comparison_query(self, query: str, product: Dict[str, Any], 
                                     related_products: List[Dict[str, Any]]) -> str:
        """Handle queries that involve comparing products."""
        if not related_products:
            return await self.rag_service.generate_response(query, "")
        
        # Create a mini comparison
        all_products = [product] + related_products
        comparison_context = "Comparing these products:\n\n"
        
        for i, prod in enumerate(all_products, 1):
            comparison_context += f"{i}. {prod.get('name', 'Unknown')} from {prod.get('institution', 'Unknown')}\n"
            if prod.get('interest_rate'):
                comparison_context += f"   Interest Rate: {prod['interest_rate']}%\n"
            if prod.get('loan_amount_max'):
                comparison_context += f"   Max Loan: Rs. {prod['loan_amount_max']:,}\n"
            comparison_context += "\n"
        
        enhanced_query = f"{query}\n\nComparison Context:\n{comparison_context}"
        return await self.rag_service.generate_response(enhanced_query, "")
    
    def _generate_recommendations(self, query: str, comparison: ProductComparison) -> Optional[List[str]]:
        """Generate product recommendations based on the query and comparison."""
        query_lower = query.lower()
        recommendations = []
        
        # Interest rate focused queries
        if any(word in query_lower for word in ['low', 'cheap', 'affordable', 'interest']):
            interest_field = next(
                (f for f in comparison.comparison_fields if f.field_name == 'interest_rate'),
                None
            )
            if interest_field and interest_field.best_option:
                recommendations.append(interest_field.best_option)
        
        # High loan amount queries
        if any(word in query_lower for word in ['high', 'large', 'maximum', 'amount']):
            amount_field = next(
                (f for f in comparison.comparison_fields if f.field_name == 'loan_amount_max'),
                None
            )
            if amount_field and amount_field.best_option:
                recommendations.append(amount_field.best_option)
        
        # Use overall best if no specific recommendations
        if not recommendations and comparison.summary.get('overall_best'):
            recommendations.append(comparison.summary['overall_best']['product_id'])
        
        return recommendations if recommendations else None
