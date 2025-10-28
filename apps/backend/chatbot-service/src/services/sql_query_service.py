import google.generativeai as genai
from typing import Dict, Any, List, Optional, Tuple
import json
import re
from src.config.settings import Settings
from src.services.prisma_client import PrismaClient
from src.utils.json_utils import process_value, json_dumps, CustomJSONEncoder
from src.models.api_models import Source

settings = Settings()
genai.configure(api_key=settings.GOOGLE_API_KEY)

class SQLQueryService:
    """Service for generating and executing SQL queries based on natural language questions."""
    
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        self.db_client = PrismaClient()
        self.table_schema = self._get_table_schema()
    
    def _get_table_schema(self) -> str:
        """
        Returns the database schema information that will help the LLM generate correct SQL.
        """
        return """
        -- FinVerse Financial Product Database Schema (MySQL)
        
        CREATE TABLE Institution (
            id VARCHAR(191) PRIMARY KEY,
            typeId VARCHAR(191) NOT NULL,
            name VARCHAR(191) NOT NULL,
            slug VARCHAR(191) UNIQUE NOT NULL,
            logoUrl VARCHAR(191),
            licenseNumber VARCHAR(191),
            countryCode VARCHAR(191) NOT NULL,
            isActive TINYINT(1) DEFAULT 1,
            createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
            updatedAt DATETIME(3)
        );
        
        CREATE TABLE InstitutionType (
            id VARCHAR(191) PRIMARY KEY,
            code VARCHAR(191) UNIQUE NOT NULL,
            name VARCHAR(191) NOT NULL,
            description VARCHAR(191)
        );
        
        CREATE TABLE ProductCategory (
            id VARCHAR(191) PRIMARY KEY,
            parentId VARCHAR(191),
            name VARCHAR(191) NOT NULL,
            slug VARCHAR(191) UNIQUE NOT NULL,
            description VARCHAR(191),
            level INT DEFAULT 0
        );
        
        CREATE TABLE ProductType (
            id VARCHAR(191) PRIMARY KEY,
            categoryId VARCHAR(191) NOT NULL,
            code VARCHAR(191) UNIQUE NOT NULL,
            name VARCHAR(191) NOT NULL,
            description VARCHAR(191)
        );
        
        CREATE TABLE Product (
            id VARCHAR(191) PRIMARY KEY,
            institutionId VARCHAR(191) NOT NULL,
            productTypeId VARCHAR(191) NOT NULL,
            name VARCHAR(191) NOT NULL,
            slug VARCHAR(191) NOT NULL,
            details JSON,  -- Contains structured data like interestRate, loanAmountMin, loanAmountMax, etc.
            isFeatured TINYINT(1) DEFAULT 0,
            isActive TINYINT(1) DEFAULT 1,
            createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
            updatedAt DATETIME(3)
        );
        
        CREATE TABLE ProductRateHistory (
            id VARCHAR(191) PRIMARY KEY,
            productId VARCHAR(191) NOT NULL,
            metric VARCHAR(191) NOT NULL,
            value DECIMAL(65,30) NOT NULL,
            currency VARCHAR(191),
            recordedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
            source VARCHAR(191)
        );
        
        CREATE TABLE ProductTag (
            id VARCHAR(191) PRIMARY KEY,
            name VARCHAR(191) NOT NULL,
            slug VARCHAR(191) UNIQUE NOT NULL
        );
        
        CREATE TABLE ProductTagMap (
            productId VARCHAR(191) NOT NULL,
            tagId VARCHAR(191) NOT NULL,
            PRIMARY KEY (productId, tagId)
        );
        
        CREATE TABLE Review (
            id VARCHAR(191) PRIMARY KEY,
            clerkUserId VARCHAR(191) NOT NULL,
            productId VARCHAR(191) NOT NULL,
            rating INT NOT NULL,
            comment VARCHAR(191),
            createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
        );
        
        -- JSON Details structure example:
        -- {
        --   "interestRate": 7.99,
        --   "loanAmountMin": 5000,
        --   "loanAmountMax": 50000,
        --   "termMin": 12,
        --   "termMax": 60,
        --   "requirements": ["Credit score of 680+", "Proof of income", "Valid ID", "SSN"],
        --   "features": ["No prepayment penalties", "Fixed monthly payments", "Quick approval process"],
        --   "originationFee": 1.5,
        --   "annualPercentageRate": 8.45
        -- }
        
        -- Example of common joins needed for product queries
        -- SELECT 
        --   p.id, p.name, p.slug, p.details,
        --   i.name as institution_name,
        --   pt.name as product_type_name, pt.description as product_type_description,
        --   pc.name as product_category_name
        -- FROM Product p
        -- JOIN Institution i ON p.institutionId = i.id
        -- JOIN ProductType pt ON p.productTypeId = pt.id
        -- JOIN ProductCategory pc ON pt.categoryId = pc.id
        -- WHERE JSON_EXTRACT(p.details, '$.interestRate') < 8.0
        -- ORDER BY JSON_EXTRACT(p.details, '$.interestRate') ASC;
        """
    
    async def generate_sql(self, query: str) -> str:
        """Generate SQL from a natural language query."""
        
        prompt = f"""
        You are a SQL query generator for a MySQL financial products database. 
        Generate a SQL query that answers the user's question about financial products.
        
        Database Schema:
        {self.table_schema}
        
        Important notes:
        1. This is a MySQL database - use MySQL syntax only
        2. Table names should NOT be quoted with double quotes - use backticks if needed
        3. The 'details' column in the Product table is JSON and contains product details like interest rates
        4. To access JSON fields, use JSON_EXTRACT(column, '$.field') function
        5. For example: JSON_EXTRACT(details, '$.interestRate') to get the interest rate
        6. When doing numeric comparisons: CAST(JSON_EXTRACT(details, '$.interestRate') AS DECIMAL(10,2)) < 8.0
        7. Include institution name and product name in results for better context
        8. Always join related tables to provide complete information
        9. Use MySQL functions and syntax only (no PostgreSQL ::casting or JSONB operators)
        10. Return ONLY the SQL query without any explanation or markdown
        
        User Question: {query}
        
        SQL Query:
        """
        
        response = await self.model.generate_content_async(prompt)
        sql_query = response.text.strip()
        
        # Clean up the response if it contains markdown or explanations
        if "```sql" in sql_query:
            sql_query = re.search(r"```sql\n(.*?)```", sql_query, re.DOTALL)
            if sql_query:
                sql_query = sql_query.group(1).strip()
        
        return sql_query
    
    async def execute_query(self, sql_query: str) -> Tuple[List[Dict[str, Any]], Optional[str]]:
        """
        Execute the generated SQL query and return results.
        Returns a tuple of (results, error_message)
        """
        try:
            # Safety check - only allow SELECT queries
            if not sql_query.strip().lower().startswith("select"):
                return [], "Only SELECT queries are allowed for security reasons."
            
            # Execute the query using our database connection
            conn = self.db_client.get_connection()
            cursor = conn.cursor(dictionary=True)  # Return results as dictionaries
            cursor.execute(sql_query)
            results = cursor.fetchall()
            cursor.close()
            
            # Convert psycopg2 results to Python dictionaries with proper type handling
            result_dicts = []
            for row in results:
                if isinstance(row, dict):
                    # Process each value to handle special types like Decimal
                    processed_row = {k: process_value(v) for k, v in row.items()}
                    result_dicts.append(processed_row)
                elif hasattr(row, '_asdict'):  # Handle namedtuples
                    row_dict = row._asdict()
                    processed_row = {k: process_value(v) for k, v in row_dict.items()}
                    result_dicts.append(processed_row)
                elif isinstance(row, tuple):  # Handle regular tuples
                    # Process each value in the tuple
                    processed_values = [process_value(val) for val in row]
                    # This assumes the cursor doesn't use column names
                    result_dicts.append({"column_" + str(i): val for i, val in enumerate(processed_values)})
            
            return result_dicts, None
        except Exception as e:
            return [], f"Error executing query: {str(e)}"
    
    async def format_sql_results(self, results: List[Dict[str, Any]], query: str) -> str:
        """Format SQL query results into a natural language response."""
        if not results:
            return "I couldn't find any data matching your query."
        
        # Convert results to JSON for the LLM to process using our custom encoder
        results_json = json_dumps(results[:10])  # Limit to 10 results for LLM processing
        
        prompt = f"""
        You are a financial advisor assistant. Format these database query results into a clear, 
        natural language response that answers the user's question.
        
        User question: {query}
        
        Query results (JSON): {results_json}
        
        Follow these guidelines:
        1. Start with a direct answer to the question
        2. Organize information with clear headings and bullet points where appropriate
        3. Mention specific numbers, rates, and details from the results
        4. Compare products if multiple options are available
        5. Highlight key benefits, requirements, and features
        6. Use natural, conversational language
        7. Be comprehensive but concise
        
        Response:
        """
        
        response = await self.model.generate_content_async(prompt)
        return response.text.strip()
    
    async def process_data_query(self, query: str) -> Tuple[str, List[Source]]:
        """
        Process a data-oriented query end-to-end:
        1. Generate SQL from natural language
        2. Execute the SQL query
        3. Format results into natural language
        
        Returns a tuple of (formatted_response, sources)
        """
        try:
            # Generate SQL
            sql_query = await self.generate_sql(query)
            
            # Execute SQL
            results, error = await self.execute_query(sql_query)
            
            if error:
                return f"I encountered an error: {error}", []
            
            if not results:
                return "I couldn't find any specific products matching your criteria.", []
            
            # Format results
            formatted_response = await self.format_sql_results(results, query)
            
            # Prepare sources from results
            sources = []
            for result in results[:5]:  # Limit to top 5 sources
                if 'name' in result and 'institution_name' in result:
                    sources.append(Source(
                        text=str(result.get('description', 'No description')),
                        product_id=str(result.get('id', '')),
                        product_name=str(result.get('name', 'Unknown Product'))
                    ))
            
            return formatted_response, sources
        
        except Exception as e:
            return f"I encountered an error processing your query: {str(e)}", []
