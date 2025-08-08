# filepath: /home/thiwa/Documents/projects/FinVerse/apps/backend/chatbot-service/src/services/query_orchestrator.py
"""
Module for query orchestration.
"""
import logging
import time
import traceback
import uuid
from typing import Dict, Any, List, Tuple, Optional         
from src.services.query_classifier import QueryClassifier, QueryType
from src.services.sql_query_service import SQLQueryService
from src.services.rag_service import RAGService
from src.services.chat_history_service import ChatHistoryService
from src.models.api_models import Source, Message

logger = logging.getLogger(__name__)

class QueryOrchestrator:
    """
    Orchestrates the query processing workflow by:
    1. Classifying the query type (SQL, Vector, Hybrid)
    2. Routing to appropriate service(s)
    3. Combining and returning results
    """
    
    def __init__(self):
        self.classifier = QueryClassifier()
        self.sql_service = SQLQueryService()
        self.rag_service = RAGService()
        self.chat_history_service = ChatHistoryService()
        self.query_stats = {
            "total_queries": 0,
            "sql_queries": 0,
            "vector_queries": 0,
            "hybrid_queries": 0,
            "unsupported_queries": 0,
            "errors": 0
        }
    
    async def process_query(self, query: str, conversation_id: Optional[str] = None, include_history: bool = True) -> Tuple[str, List[Source], QueryType, Optional[str], Optional[List[Message]]]:
        """
        Process a user query through the appropriate pipeline based on classification.
        Returns a tuple of (response_text, sources, query_type, conversation_id, history)
        """
        start_time = time.time()
        self.query_stats["total_queries"] += 1
        
        try:
            # Generate a new conversation ID if none provided
            if conversation_id is None:
                conversation_id = str(uuid.uuid4())
            
            # Get or initialize chat history
            history = None
            conversation_context = ""
            
            # Add the user's query to the chat history
            self.chat_history_service.add_message(conversation_id, query, "user")
            
            # Get conversation history
            if include_history:
                history = self.chat_history_service.get_conversation_history(conversation_id)
                if history and len(history) > 1:
                    conversation_context = self.chat_history_service.get_conversation_history_as_string(conversation_id)
                    logger.info(f"Including conversation context: {len(conversation_context)} chars")
            
            # Step 1: Classify the query
            query_type = await self.classifier.classify_query(query)
            logger.info(f"Query classified as: {query_type}")
            
            # Update stats
            if query_type == QueryType.SQL:
                self.query_stats["sql_queries"] += 1
            elif query_type == QueryType.VECTOR:
                self.query_stats["vector_queries"] += 1
            elif query_type == QueryType.HYBRID:
                self.query_stats["hybrid_queries"] += 1
            else:
                self.query_stats["unsupported_queries"] += 1
            
            # Prepare the enhanced query with conversation context if available
            enhanced_query = query
            if conversation_context:
                enhanced_query = f"Previous conversation:\n{conversation_context}\n\nCurrent question: {query}"
            
            # Step 2: Route based on classification
            if query_type == QueryType.SQL:
                # Process as structured data query
                answer, sql_sources_dict = await self.sql_service.process_data_query(enhanced_query)
                
                # Convert dict sources to Source objects
                sources = [
                    Source(
                        name=source.get("name", "Unknown"),
                        institution=source.get("institution", "Unknown Institution"),
                        product_id=source.get("product_id")
                    )
                    for source in sql_sources_dict
                ]
                
                # Add assistant's response to chat history
                self.chat_history_service.add_message(conversation_id, answer, "assistant")
                
                # Get updated history
                history = self.chat_history_service.get_conversation_history(conversation_id)
                
                return answer, sources, query_type, conversation_id, history
                
            elif query_type == QueryType.VECTOR:
                # Process as general knowledge query using RAG
                relevant_docs = self.rag_service.retrieve_context(query)
                context = self.rag_service.format_context(relevant_docs)
                
                # Add conversation context if available
                final_context = context
                if conversation_context:
                    final_context = f"Previous conversation:\n{conversation_context}\n\nAdditional context:\n{context}"
                
                answer = await self.rag_service.generate_response(query, final_context)
                
                # Format sources
                sources = [
                    Source(
                        name=doc.metadata.get("name", "Unknown"),
                        institution=doc.metadata.get("institution", "Unknown Institution"),
                        product_id=doc.metadata.get("product_id")
                    )
                    for doc in relevant_docs
                ]
                
                # Add assistant's response to chat history
                self.chat_history_service.add_message(conversation_id, answer, "assistant")
                
                # Get updated history
                history = self.chat_history_service.get_conversation_history(conversation_id)
                
                return answer, sources, query_type, conversation_id, history
                
            elif query_type == QueryType.HYBRID:
                # Process as hybrid query - get both SQL and RAG results
                sql_response, sql_sources_dict = await self.sql_service.process_data_query(query)
                
                # Get RAG response
                relevant_docs = self.rag_service.retrieve_context(query)
                context = self.rag_service.format_context(relevant_docs)
                
                # Combine both contexts
                combined_prompt = f"""
                You are a financial advisor assistant for Sri Lankan financial products. Use both the structured data and general knowledge to answer the user's question.
                """
                
                if conversation_context:
                    combined_prompt += f"""
                Previous conversation:
                {conversation_context}
                """
                
                combined_prompt += f"""
                Structured Data Information (from database):
                {sql_response}
                
                General Knowledge Context (from vector search):
                {context}
                
                User Question: {query}
                
                Guidelines for your response:
                1. Start with a direct answer to the question
                2. Prioritize factual structured data over general knowledge when there are conflicts
                3. Include specific numbers, rates, and details from both sources
                4. Organize your response with clear sections and bullet points
                5. Compare options if multiple products are mentioned
                6. Be thorough but concise
                7. Use natural, conversational language
                
                Answer:
                """
                
                # Generate combined response
                combined_answer = await self.rag_service.generate_response(combined_prompt, "")
                
                # Combine sources
                sql_sources = [
                    Source(
                        name=source.get("name", "Unknown"),
                        institution=source.get("institution", "Unknown Institution"),
                        product_id=source.get("product_id")
                    )
                    for source in sql_sources_dict
                ]
                
                vector_sources = [
                    Source(
                        name=doc.metadata.get("name", "Unknown"),
                        institution=doc.metadata.get("institution", "Unknown Institution"),
                        product_id=doc.metadata.get("product_id")
                    )
                    for doc in relevant_docs
                ]
                
                combined_sources = sql_sources + vector_sources
                
                # Add assistant's response to chat history
                self.chat_history_service.add_message(conversation_id, combined_answer, "assistant")
                
                # Get updated history
                history = self.chat_history_service.get_conversation_history(conversation_id)
                
                return combined_answer, combined_sources, query_type, conversation_id, history
                
            else:  # UNSUPPORTED
                answer = "I'm sorry, but that question is outside my area of expertise in financial products and services."
                
                # Add assistant's response to chat history
                self.chat_history_service.add_message(conversation_id, answer, "assistant")
                
                # Get updated history
                history = self.chat_history_service.get_conversation_history(conversation_id)
                
                return answer, [], query_type, conversation_id, history
                
        except Exception as e:
            logger.error(f"Error in query orchestration: {str(e)}")
            logger.error(traceback.format_exc())  # Log the stack trace for debugging
            self.query_stats["errors"] += 1
            error_msg = f"I encountered an error processing your question. Please try rephrasing or ask something about financial products."
            return error_msg, [], QueryType.UNSUPPORTED, conversation_id, None
        finally:
            # Log the query performance
            elapsed_time = time.time() - start_time
            logger.info(f"Processed query in {elapsed_time:.2f} seconds")
    
    def get_query_stats(self) -> Dict[str, Any]:
        """
        Returns the query statistics.
        """
        return self.query_stats
    
    def reset_query_stats(self):
        """
        Resets the query statistics.
        """
        self.query_stats = {
            "total_queries": 0,
            "sql_queries": 0,
            "vector_queries": 0,
            "hybrid_queries": 0,
            "unsupported_queries": 0,
            "errors": 0
        }
