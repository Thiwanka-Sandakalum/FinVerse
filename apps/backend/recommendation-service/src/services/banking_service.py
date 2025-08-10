"""
Client for interacting with the Banking Service API to fetch product data.
"""
import aiohttp
import logging
from typing import Dict, Any, List, Optional

from src.core.config import settings

logger = logging.getLogger("recommendation-service")

class BankingServiceClient:
    """Client for interacting with the Banking Service API"""
    
    def __init__(self, base_url: str = settings.BANKING_SERVICE_URL):
        """
        Initialize the Banking Service client.
        
        Args:
            base_url: Base URL of the Banking Service API
        """
        self.base_url = base_url
        
    async def get_product_details(self, product_id: str) -> Dict[str, Any]:
        """
        Get details for a specific product.
        
        Args:
            product_id: ID of the product
            
        Returns:
            Product details
        """
        url = f"{self.base_url}/products/{product_id}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("data", {})
                    else:
                        logger.error(f"Failed to get product {product_id}: {response.status}")
                        return {"id": product_id, "name": f"Product {product_id}"}
        except Exception as e:
            logger.error(f"Error getting product {product_id}: {str(e)}")
            return {"id": product_id, "name": f"Product {product_id}"}
            
    async def get_product_details_batch(self, product_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Get details for multiple products.
        
        Args:
            product_ids: List of product IDs
            
        Returns:
            Dict mapping product IDs to product details
        """
        # Use product search endpoint with ID filter for batch retrieval
        url = f"{self.base_url}/products/search"
        
        try:
            # Create filter for product IDs
            filter_param = {"ids": product_ids}
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=filter_param) as response:
                    if response.status == 200:
                        data = await response.json()
                        products = data.get("data", [])
                        
                        # Convert to dict with product ID as key
                        product_dict = {}
                        for product in products:
                            product_dict[product.get("id")] = product
                            
                        # Add placeholder for missing products
                        for pid in product_ids:
                            if pid not in product_dict:
                                product_dict[pid] = {"id": pid, "name": f"Product {pid}"}
                                
                        return product_dict
                    else:
                        logger.error(f"Failed to get products: {response.status}")
        except Exception as e:
            logger.error(f"Error getting products: {str(e)}")
        
        # Fallback: Get products one by one
        product_dict = {}
        for pid in product_ids:
            product_dict[pid] = await self.get_product_details(pid)
            
        return product_dict
        
    async def get_popular_products(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get the most popular products.
        
        Args:
            limit: Maximum number of products to return
            
        Returns:
            List of popular products
        """
        url = f"{self.base_url}/products/popular?limit={limit}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data.get("data", [])
                    else:
                        logger.error(f"Failed to get popular products: {response.status}")
                        return []
        except Exception as e:
            logger.error(f"Error getting popular products: {str(e)}")
            return []
