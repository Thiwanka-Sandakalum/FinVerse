"""
Service for comparing multiple financial products.
"""

import logging
from typing import List, Dict, Any, Optional
from src.services.database_service import DatabaseService

logger = logging.getLogger(__name__)

class ProductComparisonService:
    """Service to compare multiple financial products."""
    
    def __init__(self, db_service: DatabaseService):
        """Initialize the product comparison service."""
        self.db_service = db_service
    
    def compare_products(self, product_ids: List[str]) -> Dict[str, Any]:
        """
        Compare multiple products and return a structured comparison.
        
        Args:
            product_ids: List of product IDs to compare
            
        Returns:
            A dictionary containing the comparison results
        """
        # Get the products by their IDs
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
        
        # Collect all possible attribute keys across all products
        all_attributes = set()
        for product in products:
            all_attributes.update(product.keys())
        
        # Remove irrelevant attributes for comparison
        exclude_attrs = {"id", "updatedAt", "createdAt", "description"}
        comparison_attrs = all_attributes - exclude_attrs
        
        # Create the comparison dictionary
        comparison = {
            "product_type": product_type,
            "products": products,
            "comparison_table": {}
        }
        
        # Fill in the comparison table
        for attr in sorted(comparison_attrs):
            comparison["comparison_table"][attr] = {
                product["name"]: product.get(attr) for product in products
            }
        
        return comparison
    
    async def generate_comparison_summary(self, comparison: Dict[str, Any]) -> str:
        """
        Generate a textual summary of the comparison.
        
        Args:
            comparison: The comparison dictionary from compare_products
            
        Returns:
            A formatted string summarizing the comparison
        """
        if not comparison.get("products"):
            return "No products found for comparison."
        
        products = comparison["products"]
        product_type = comparison.get("product_type", "Financial Products")
        
        # Generate a basic summary
        summary = f"# Comparison of {len(products)} {product_type}s\n\n"
        
        # Create a markdown table for key attributes
        key_attributes = [
            "name", "institution", "interest_rate", "loan_amount_min", 
            "loan_amount_max", "term_min", "term_max", "annual_percentage_rate"
        ]
        
        # Filter out attributes that don't exist in the comparison
        existing_attributes = [attr for attr in key_attributes 
                              if attr in comparison["comparison_table"]]
        
        # Create table header
        summary += "| Attribute | " + " | ".join(p["name"] for p in products) + " |\n"
        summary += "| --- | " + " | ".join(["---"] * len(products)) + " |\n"
        
        # Add rows for each attribute
        for attr in existing_attributes:
            # Make the attribute name more readable
            display_name = attr.replace("_", " ").title()
            
            # Get values for each product
            values = []
            for p in products:
                val = p.get(attr, "N/A")
                # Format values nicely
                if isinstance(val, (int, float)) and "amount" in attr.lower():
                    val = f"{val:,.2f}" if val else "N/A"
                values.append(str(val))
            
            # Add the row
            summary += f"| {display_name} | " + " | ".join(values) + " |\n"
        
        # Add a section for features comparison if available
        if "features" in comparison["comparison_table"]:
            summary += "\n## Features\n\n"
            for i, p in enumerate(products):
                summary += f"### {p['name']}\n"
                features = p.get("features", [])
                if features:
                    for feature in features:
                        summary += f"- {feature}\n"
                else:
                    summary += "- No features listed\n"
                summary += "\n"
        
        # Add a section for requirements comparison if available
        if "requirements" in comparison["comparison_table"]:
            summary += "\n## Requirements\n\n"
            for i, p in enumerate(products):
                summary += f"### {p['name']}\n"
                requirements = p.get("requirements", [])
                if requirements:
                    for req in requirements:
                        summary += f"- {req}\n"
                else:
                    summary += "- No specific requirements listed\n"
                summary += "\n"
        
        return summary