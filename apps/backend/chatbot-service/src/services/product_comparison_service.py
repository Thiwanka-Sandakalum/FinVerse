"""
Service for comparing multiple financial products.
"""

import logging
import json
from typing import List, Dict, Any, Optional, cast

import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel

from src.services.database_service import DatabaseService
from src.config.settings import Settings
from src.utils.json_utils import CustomJSONEncoder

logger = logging.getLogger(__name__)
settings = Settings()
genai.configure(api_key=settings.GOOGLE_API_KEY)

class ProductComparisonService:
    """Service to compare multiple financial products."""
    
    def __init__(self, db_service: DatabaseService):
        """Initialize the product comparison service."""
        self.db_service = db_service
        # Initialize the generative AI model
        self.model = GenerativeModel("gemini-2.5-flash")
    
    def compare_products(self, product_ids: List[str]) -> Dict[str, Any]:
        """
        Compare multiple products and return a structured comparison.
        
        Args:
            product_ids: List of product IDs to compare
            
        Returns:
            A dictionary containing the comparison results with raw product data
        """
        # Get the products by their IDs directly from the database
        products = []
        for product_id in product_ids:
            product = self.db_service.get_product_by_id(product_id)
            if product:
                products.append(product)
        
        if not products:
            return {
                "error": "No valid products found for comparison",
                "products": []
            }
        
        # Get the product type from the first product
        product_type = products[0]["type"] if products else None
        
        # Return the raw product data for LLM processing
        return {
            "product_type": product_type,
            "products": products
        }
    
    async def generate_comparison_summary(self, comparison: Dict[str, Any]) -> str:
        """
        Generate a textual summary of the comparison using LLM.
        
        Args:
            comparison: The comparison dictionary from compare_products with raw product data
            
        Returns:
            A formatted string summarizing the comparison
        """
        if not comparison.get("products"):
            return "No products found for comparison."
        
        products = comparison["products"]
        product_type = comparison.get("product_type", "Financial Products")
        
        # Use the raw product data directly from the database
        products_data = []
        for product in products:
            # We'll use the raw product data directly
            products_data.append(product)
        
        # Convert to JSON for the LLM
        products_json = json.dumps(products_data, cls=CustomJSONEncoder, indent=2)
        
        # Prepare the prompt for the LLM with raw product data
        prompt = f"""
        You are a helpful financial advisor assistant specializing in product comparisons.
        
        I'm going to provide you with information about {len(products)} {product_type}s directly from our database, and I need you to:
        
        1. Compare them in a clear, structured format
        2. Highlight the key differences between them
        3. Identify which product might be better for different types of customers
        4. Format your response with Markdown for better readability
        
        Here are the raw products to compare (notice some products may have different attributes):
        {products_json}
        
        Please provide a comprehensive comparison with these sections:
        - Overview of all products
        - Detailed comparison of key attributes (focus on financial terms like interest rates, fees, etc.)
        - Feature comparison (if features are present)
        - Requirements comparison (if requirements are present)
        - Recommendations for different customer profiles (e.g., who should choose which product)
        
        Important notes:
        - Products may have completely different attributes - analyze what's available and highlight differences
        - Don't make up any data that isn't present
        - Explain any specialized terms or features in simple language
        - Skip attributes like 'id', 'updatedAt', 'createdAt' as they aren't relevant to the comparison
        
        Format your response as a well-structured Markdown document with headings, bullet points,
        and a comparison table for attributes that make sense to compare.
        """
        
        try:
            # Generate the comparison summary using the LLM
            response = await self.model.generate_content_async(prompt)
            summary = response.text
            
            # If we didn't get a good response, fall back to basic formatting
            if not summary or len(summary) < 100:
                logger.warning("LLM generated a short or empty response, falling back to basic formatting")
                return self._generate_basic_comparison(comparison)
                
            return summary
            
        except Exception as e:
            logger.error(f"Error generating comparison summary with LLM: {str(e)}")
            # Fall back to basic formatting if LLM fails
            return self._generate_basic_comparison(comparison)
    
    def _generate_basic_comparison(self, comparison: Dict[str, Any]) -> str:
        """
        Generate a basic comparison summary without using LLM.
        This is a fallback method in case the LLM fails.
        
        Args:
            comparison: The comparison dictionary with raw product data
            
        Returns:
            A formatted string summarizing the comparison
        """
        products = comparison.get("products", [])
        product_type = comparison.get("product_type", "Financial Products")
        
        # Generate a basic summary
        summary = f"# Comparison of {len(products)} {product_type}s\n\n"
        
        # Add product names
        summary += "## Products Being Compared\n\n"
        for idx, product in enumerate(products, 1):
            summary += f"{idx}. **{product.get('name', 'Unknown Product')}** by {product.get('institution', 'Unknown Institution')}\n"
        
        summary += "\n## Detailed Comparison\n\n"
        
        # Create a comparison table for numerical attributes
        # Dynamically collect numeric attributes from all products
        numeric_attrs = set()
        for product in products:
            for key, value in product.items():
                # Identify numeric fields and important string fields
                if (isinstance(value, (int, float)) or 
                    (isinstance(value, str) and any(x in key.lower() for x in 
                    ["rate", "amount", "fee", "term", "price", "cost", "minimum", "maximum"]))):
                    numeric_attrs.add(key)
        
        # Remove non-financial attributes
        exclude_from_numeric = {"id", "updatedAt", "createdAt", "description"}
        numeric_attrs = numeric_attrs - exclude_from_numeric
                
        # Only proceed if we have numeric attributes to compare
        if numeric_attrs:
            # Create header
            summary += "### Key Financial Terms\n\n"
            summary += "| Attribute | " + " | ".join([p.get("name", f"Product {i+1}") for i, p in enumerate(products)]) + " |\n"
            summary += "|" + "-|"*len(products) + "-|\n"
            
            # Add rows for each attribute
            for attr in sorted(numeric_attrs):
                # Create a display name for the attribute
                display_name = attr.replace("_", " ").title() if isinstance(attr, str) else str(attr)
                values = []
                for product in products:
                    val = product.get(attr, "N/A")
                    values.append(str(val))
                
                summary += f"| {display_name} | " + " | ".join(values) + " |\n"
        
        # Add features section if any product has features
        has_features = any(product.get("features") for product in products)
        if has_features:
            summary += "\n### Features\n\n"
            for product in products:
                name = product.get("name", "Unknown Product")
                features = product.get("features", [])
                
                summary += f"**{name}**:\n"
                if features:
                    for feature in features:
                        summary += f"- {feature}\n"
                else:
                    summary += "- No specific features listed\n"
                summary += "\n"
        
        # Add requirements section if any product has requirements
        has_requirements = any(product.get("requirements") for product in products)
        if has_requirements:
            summary += "\n### Requirements\n\n"
            for product in products:
                name = product.get("name", "Unknown Product")
                requirements = product.get("requirements", [])
                
                summary += f"**{name}**:\n"
                if requirements:
                    for req in requirements:
                        summary += f"- {req}\n"
                else:
                    summary += "- No specific requirements listed\n"
                summary += "\n"
        
        return summary