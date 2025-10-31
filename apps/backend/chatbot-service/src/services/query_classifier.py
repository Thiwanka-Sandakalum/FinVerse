from enum import Enum
from typing import Literal, Dict, Any, List, Optional
import re
import google.generativeai as genai
from src.config.settings import Settings

settings = Settings()
genai.configure(api_key=settings.GOOGLE_API_KEY)

class QueryType(str, Enum):
    SQL = "sql"
    VECTOR = "vector"
    HYBRID = "hybrid"
    UNSUPPORTED = "unsupported"

class QueryClassifier:
    """
    Classifies user queries into different types for appropriate handling.
    """
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    async def classify_query(self, query: str) -> QueryType:
        """
        Classifies a user query as SQL (structured data), VECTOR (general knowledge),
        HYBRID (mixture), or UNSUPPORTED.
        """
        
        # Simple rule-based checks for common patterns
        sql_keywords = ["list", "show me", "compare", "what is the", "which", 
                      "how much", "find", "search for", "get", "lowest", "highest"]
        
        # Check for SQL-like patterns
        for keyword in sql_keywords:
            if keyword.lower() in query.lower():
                # Double-check with LLM for more complex decisions
                return await self._llm_classify(query)
        
        # Default to vector search for general questions
        return await self._llm_classify(query)
    
    async def _llm_classify(self, query: str) -> QueryType:
        """Use LLM to classify the query type with more nuance."""
        
        prompt = f"""You are a query classifier for a financial products assistant.
        Classify the following user query into one of these categories:
        
        - "sql": For questions about specific financial product details, rates, terms, comparisons that can be answered with structured data.
        - "vector": For general financial knowledge, explanations, processes, or conceptual questions.
        - "hybrid": For questions requiring both specific product data and general knowledge.
        - "unsupported": For questions outside the scope of financial products and services.
        
        Examples:
        - "What is the lowest interest rate for personal loans?" -> "sql"
        - "How does a mortgage work?" -> "vector"
        - "Which bank offers the best loan for students and what are the eligibility criteria?" -> "hybrid"
        - "How do I make pizza?" -> "unsupported"
        
        User query: "{query}"
        
        Classification (return only "sql", "vector", "hybrid", or "unsupported"):
        """
        
        response = await self.model.generate_content_async(prompt)
        result = response.text.strip().lower()
        
        # Ensure we get a valid response
        if result in ["sql", "vector", "hybrid", "unsupported"]:
            return QueryType(result)
        else:
            # Default to SQL if classification is unclear
            return QueryType.SQL
