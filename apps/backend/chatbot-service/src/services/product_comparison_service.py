"""
Product Comparison Service

This service handles product comparison logic, including:
1. Fetching and comparing products
2. Generating structured comparison tables
3. Identifying best options for different criteria
4. Providing intelligent recommendations
"""

import uuid
import logging
from typing import List, Dict, Any, Optional, Tuple
from decimal import Decimal
from datetime import datetime, timedelta

from src.services.database_service import DatabaseService, get_db
from src.models.api_models import (
    ProductComparison, ComparisonField, ProductComparisonRequest
)

logger = logging.getLogger(__name__)

class ProductComparisonService:
    """Service for comparing financial products and generating structured comparisons."""
    
    def __init__(self):
        self.db_service = DatabaseService(get_db())
        self.comparisons_cache = {}  # In-memory cache for recent comparisons
        self.cache_ttl = timedelta(hours=1)  # Cache comparisons for 1 hour
        
        # Define comparison field configurations
        self.comparison_field_configs = {
            "interest_rate": {
                "label": "Interest Rate (%)",
                "type": "numeric",
                "lower_is_better": True,
                "format": "{:.2f}%"
            },
            "loan_amount_max": {
                "label": "Maximum Loan Amount",
                "type": "numeric", 
                "lower_is_better": False,
                "format": "Rs. {:,.2f}"
            },
            "loan_amount_min": {
                "label": "Minimum Loan Amount",
                "type": "numeric",
                "lower_is_better": True,
                "format": "Rs. {:,.2f}"
            },
            "term_max": {
                "label": "Maximum Term (Months)",
                "type": "numeric",
                "lower_is_better": False,
                "format": "{} months"
            },
            "term_min": {
                "label": "Minimum Term (Months)",
                "type": "numeric",
                "lower_is_better": True,
                "format": "{} months"
            },
            "origination_fee": {
                "label": "Origination Fee",
                "type": "numeric",
                "lower_is_better": True,
                "format": "Rs. {:,.2f}"
            },
            "annual_percentage_rate": {
                "label": "Annual Percentage Rate (%)",
                "type": "numeric",
                "lower_is_better": True,
                "format": "{:.2f}%"
            },
            "institution": {
                "label": "Financial Institution",
                "type": "categorical",
                "format": "{}"
            },
            "type": {
                "label": "Product Type",
                "type": "categorical", 
                "format": "{}"
            }
        }
    
    async def compare_products(self, request: ProductComparisonRequest) -> Tuple[ProductComparison, str]:
        """
        Compare multiple products and return structured comparison data.
        
        Returns:
            Tuple of (ProductComparison, comparison_id)
        """
        try:
            # Fetch product data
            products = []
            for product_id in request.product_ids:
                product = self.db_service.get_product_by_id(product_id)
                if product:
                    products.append(product)
                else:
                    logger.warning(f"Product with ID {product_id} not found")
            
            if len(products) < 2:
                raise ValueError("At least 2 products are required for comparison")
            
            # Determine fields to compare
            comparison_fields = request.comparison_fields or self._get_default_comparison_fields(products)
            
            # Generate comparison data
            comparison_field_objects = []
            for field_name in comparison_fields:
                if field_name in self.comparison_field_configs:
                    field_obj = self._compare_field(products, field_name)
                    if field_obj:
                        comparison_field_objects.append(field_obj)
            
            # Generate summary and recommendations
            summary = self._generate_comparison_summary(products, comparison_field_objects)
            
            # Create comparison object
            comparison = ProductComparison(
                products=products,
                comparison_fields=comparison_field_objects,
                summary=summary
            )
            
            # Generate comparison ID and cache
            comparison_id = str(uuid.uuid4())
            self._cache_comparison(comparison_id, comparison)
            
            return comparison, comparison_id
            
        except Exception as e:
            logger.error(f"Error comparing products: {str(e)}")
            raise
    
    def get_cached_comparison(self, comparison_id: str) -> Optional[ProductComparison]:
        """Retrieve a cached comparison by ID."""
        if comparison_id in self.comparisons_cache:
            cached_item = self.comparisons_cache[comparison_id]
            if datetime.now() - cached_item['timestamp'] < self.cache_ttl:
                return cached_item['comparison']
            else:
                # Remove expired cache entry
                del self.comparisons_cache[comparison_id]
        return None
    
    def _cache_comparison(self, comparison_id: str, comparison: ProductComparison):
        """Cache a comparison result."""
        self.comparisons_cache[comparison_id] = {
            'comparison': comparison,
            'timestamp': datetime.now()
        }
    
    def _get_default_comparison_fields(self, products: List[Dict[str, Any]]) -> List[str]:
        """Determine default fields to compare based on available product data."""
        # Get all available fields from products
        all_fields = set()
        for product in products:
            all_fields.update(product.keys())
        
        # Select relevant comparison fields in order of priority
        default_fields = []
        priority_fields = [
            "interest_rate", "loan_amount_max", "loan_amount_min", 
            "term_max", "origination_fee", "annual_percentage_rate",
            "institution", "type"
        ]
        
        for field in priority_fields:
            if field in all_fields and field in self.comparison_field_configs:
                # Check if at least one product has a non-null value for this field
                has_value = any(product.get(field) is not None for product in products)
                if has_value:
                    default_fields.append(field)
        
        return default_fields
    
    def _compare_field(self, products: List[Dict[str, Any]], field_name: str) -> Optional[ComparisonField]:
        """Compare a specific field across products."""
        config = self.comparison_field_configs.get(field_name)
        if not config:
            return None
        
        # Extract values for this field
        values = {}
        numeric_values = []
        
        for product in products:
            value = product.get(field_name)
            if value is not None:
                values[product['id']] = value
                # Convert to float for numeric comparison
                if config['type'] == 'numeric' and isinstance(value, (int, float, Decimal)):
                    numeric_values.append((product['id'], float(value)))
        
        if not values:
            return None  # No products have this field
        
        # Determine best option for numeric fields
        best_option = None
        notes = None
        
        if config['type'] == 'numeric' and numeric_values:
            if config.get('lower_is_better', False):
                best_product_id, best_value = min(numeric_values, key=lambda x: x[1])
            else:
                best_product_id, best_value = max(numeric_values, key=lambda x: x[1])
            
            best_option = best_product_id
            
            # Generate contextual notes
            if field_name == 'interest_rate':
                notes = f"Lower interest rate means lower borrowing cost"
            elif field_name == 'loan_amount_max':
                notes = f"Higher maximum amount provides more borrowing flexibility"
            elif field_name == 'origination_fee':
                notes = f"Lower fees reduce upfront costs"
        
        return ComparisonField(
            field_name=field_name,
            field_label=config['label'],
            values=values,
            best_option=best_option,
            notes=notes
        )
    
    def _generate_comparison_summary(self, products: List[Dict[str, Any]], 
                                   comparison_fields: List[ComparisonField]) -> Dict[str, Any]:
        """Generate a summary with recommendations and insights."""
        summary = {
            "total_products": len(products),
            "institutions_represented": len(set(p.get('institution', '') for p in products)),
            "product_types": list(set(p.get('type', '') for p in products)),
            "recommendations": {},
            "key_differences": [],
            "overall_best": None
        }
        
        # Count wins for each product
        product_wins = {}
        for product in products:
            product_wins[product['id']] = 0
        
        # Analyze comparison fields
        for field in comparison_fields:
            if field.best_option and field.best_option in product_wins:
                product_wins[field.best_option] += 1
        
        # Find overall best performing product
        if product_wins:
            best_product_id = max(product_wins.keys(), key=lambda x: product_wins[x])
            best_product = next(p for p in products if p['id'] == best_product_id)
            summary["overall_best"] = {
                "product_id": best_product_id,
                "product_name": best_product.get('name', ''),
                "institution": best_product.get('institution', ''),
                "wins": product_wins[best_product_id],
                "total_criteria": len(comparison_fields)
            }
        
        # Generate specific recommendations
        interest_rate_field = next((f for f in comparison_fields if f.field_name == 'interest_rate'), None)
        if interest_rate_field and interest_rate_field.best_option:
            best_rate_product = next(p for p in products if p['id'] == interest_rate_field.best_option)
            summary["recommendations"]["lowest_interest_rate"] = {
                "product_id": interest_rate_field.best_option,
                "product_name": best_rate_product.get('name', ''),
                "institution": best_rate_product.get('institution', ''),
                "value": interest_rate_field.values.get(interest_rate_field.best_option)
            }
        
        # Identify key differences
        for field in comparison_fields:
            if len(set(field.values.values())) > 1:  # Field has different values
                field_values = list(field.values.values())
                if all(isinstance(v, (int, float, Decimal)) for v in field_values):
                    min_val = min(field_values)
                    max_val = max(field_values)
                    if max_val != min_val:
                        diff_percentage = ((max_val - min_val) / min_val) * 100 if min_val != 0 else 100
                        summary["key_differences"].append({
                            "field": field.field_label,
                            "min_value": min_val,
                            "max_value": max_val,
                            "difference_percentage": round(diff_percentage, 2)
                        })
        
        return summary
    
    def get_products_by_ids(self, product_ids: List[str]) -> List[Dict[str, Any]]:
        """Get multiple products by their IDs."""
        products = []
        for product_id in product_ids:
            product = self.db_service.get_product_by_id(product_id)
            if product:
                products.append(product)
        return products
