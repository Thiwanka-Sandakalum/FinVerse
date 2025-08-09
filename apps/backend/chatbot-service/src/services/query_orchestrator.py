# filepath: /home/thiwa/Documents/projects/FinVerse/apps/backend/chatbot-service/src/services/query_orchestrator.py
"""
Module for query orchestration.
"""
import logging
import time
import traceback
from typing import List, Tuple, Optional, Dict, Any
import uuid
from src.services.query_classifier import QueryClassifier, QueryType
from src.services.sql_query_service import SQLQueryService
from src.services.rag_service import RAGService
from src.services.chat_history_service import ChatHistoryService
from src.services.product_comparison_service import ProductComparisonService
from src.services.product_chat_service import ProductChatService
from src.services.database_service import DatabaseService
from src.services.prisma_client import PrismaClient
from src.models.api_models import Message, Source

logger = logging.getLogger(__name__)

class QueryOrchestrator:
    """
    Orchestrates the processing of queries through appropriate services
    based on query classification.
    """
    
    def __init__(self, chat_history_service: Optional[ChatHistoryService] = None):
        """Initialize the query orchestrator with required services."""
        self.query_classifier = QueryClassifier()
        self.sql_query_service = SQLQueryService()
        self.rag_service = RAGService()
        self.chat_history_service = chat_history_service or ChatHistoryService()
        
        # Initialize additional services with database
        prisma_client = PrismaClient()
        db_service = DatabaseService(prisma_client)
        self.product_comparison_service = ProductComparisonService(db_service)
        self.product_chat_service = ProductChatService(
            rag_service=self.rag_service,
            chat_history_service=self.chat_history_service,
            db_service=db_service
        )
        
        # Basic tracking of query stats
        self.query_stats = {
            "total_queries": 0,
            "sql_queries": 0,
            "vector_queries": 0,
            "hybrid_queries": 0,
            "unsupported_queries": 0,
            "avg_response_time_ms": 0,
            "last_10_response_times_ms": []
        }
    
    async def process_query(self, query: str, conversation_id: Optional[str] = None, 
                          include_history: bool = True, user_id: Optional[str] = None) -> Tuple[str, List[Source], QueryType, str, Optional[List[Message]]]:
        """
        Process a user query through the appropriate pipeline based on classification.
        Returns a tuple of (response_text, sources, query_type, conversation_id, history)
        """
        start_time = time.time()
        self.query_stats["total_queries"] += 1
        
        try:
            # Generate a conversation ID if none provided
            if not conversation_id:
                conversation_id = str(uuid.uuid4())
            
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
            
            # Classify the query
            query_type = await self.query_classifier.classify_query(query)
            logger.info(f"Query classified as: {query_type}")
            
            # Track query type in stats
            if query_type == QueryType.SQL:
                self.query_stats["sql_queries"] += 1
                answer, sources = await self.sql_query_service.process_data_query(query)
            elif query_type == QueryType.VECTOR:
                self.query_stats["vector_queries"] += 1
                # For vector search, get context, format it, and generate a response
                context_docs = self.rag_service.retrieve_context(query)
                context = self.rag_service.format_context(context_docs)
                answer = await self.rag_service.generate_response(query, context)
                # Create sources from context documents
                sources = []
                for doc in context_docs[:3]:
                    sources.append(Source(
                        text=doc.page_content[:100],
                        product_id=str(doc.metadata.get("product_id", "")) if doc.metadata else ""
                    ))
            elif query_type == QueryType.HYBRID:
                self.query_stats["hybrid_queries"] += 1
                # Try SQL first
                sql_answer, sql_sources = await self.sql_query_service.process_data_query(query)
                
                # Then try vector search
                context_docs = self.rag_service.retrieve_context(query)
                context = self.rag_service.format_context(context_docs)
                vector_answer = await self.rag_service.generate_response(query, context)
                
                # Create vector sources
                vector_sources = []
                for doc in context_docs[:3]:
                    vector_sources.append(Source(
                        text=doc.page_content[:100],
                        product_id=str(doc.metadata.get("product_id", "")) if doc.metadata else ""
                    ))
                
                # For hybrid, we'll prefer the SQL answer if it has meaningful sources,
                # otherwise we'll use the vector answer
                if sql_sources and len(sql_sources) > 0:
                    answer = sql_answer
                    sources = sql_sources
                else:
                    answer = vector_answer
                    sources = vector_sources
            else:  # UNSUPPORTED
                self.query_stats["unsupported_queries"] += 1
                answer = "I'm sorry, but I don't understand your question. Could you please rephrase it or ask something about our financial products?"
                sources = []
            
            # Add the assistant's response to history
            self.chat_history_service.add_message(conversation_id, answer, "assistant", user_id)
            
            # Track response time
            end_time = time.time()
            response_time_ms = (end_time - start_time) * 1000
            
            # Update moving average of response times
            self.query_stats["last_10_response_times_ms"].append(response_time_ms)
            if len(self.query_stats["last_10_response_times_ms"]) > 10:
                self.query_stats["last_10_response_times_ms"].pop(0)
            
            self.query_stats["avg_response_time_ms"] = sum(self.query_stats["last_10_response_times_ms"]) / len(self.query_stats["last_10_response_times_ms"])
            
            return answer, sources, query_type, conversation_id, history
        
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            logger.error(traceback.format_exc())
            return "I'm sorry, but an error occurred while processing your query. Please try again.", [], QueryType.UNSUPPORTED, conversation_id or str(uuid.uuid4()), None
    
    async def handle_product_comparison(self, product_ids: List[str], conversation_id: str, user_id: Optional[str] = None) -> str:
        """
        Handle a product comparison request.
        
        Args:
            product_ids: List of product IDs to compare
            conversation_id: The conversation ID
            user_id: Optional user ID
            
        Returns:
            A formatted comparison summary
        """
        try:
            # Log the comparison request
            product_list = ", ".join(product_ids)
            logger.info(f"Handling product comparison for products: {product_list}")
            
            # Ensure we have a valid conversation ID
            if not conversation_id:
                conversation_id = str(uuid.uuid4())
                logger.info(f"Created new conversation ID: {conversation_id}")
                # Create the conversation in the database
                if self.chat_history_service:
                    self.chat_history_service.create_conversation(conversation_id, user_id)
            
            # Generate the comparison
            comparison = self.product_comparison_service.compare_products(product_ids)
            
            # Generate the formatted summary using LLM
            summary = await self.product_comparison_service.generate_comparison_summary(comparison)
            
            # Save the comparison message to the chat history
            if self.chat_history_service:
                self.chat_history_service.add_message(
                    conversation_id=conversation_id,
                    text=summary,
                    role="assistant",
                    user_id=user_id
                )
            
            return summary
            
        except Exception as e:
            error_msg = f"Error handling product comparison: {str(e)}"
            logger.error(error_msg)
            logger.error(traceback.format_exc())
            return f"I encountered an error while comparing the products: {str(e)}"
            
    def get_query_stats(self) -> Dict[str, Any]:
        """Get the current query statistics."""
        return self.query_stats
        
    def reset_query_stats(self) -> None:
        """Reset the query statistics."""
        self.query_stats = {
            "total_queries": 0,
            "sql_queries": 0,
            "vector_queries": 0,
            "hybrid_queries": 0,
            "unsupported_queries": 0,
            "avg_response_time_ms": 0,
            "last_10_response_times_ms": []
        }