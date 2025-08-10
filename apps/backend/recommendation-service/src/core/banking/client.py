"""Handles all banking-related services."""

import httpx
from typing import Dict, Any, List

class BankingServiceClient:
    """Client for interacting with the banking service API."""
    
    def __init__(self, base_url: str):
        """
        Initialize the banking service client.
        
        Args:
            base_url: Base URL of the banking service API
        """
        self.base_url = base_url.rstrip('/')
        
    async def get_product_details_batch(self, product_ids: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Get product details for multiple products in a single request.
        
        Args:
            product_ids: List of product IDs to get details for
            
        Returns:
            Dict mapping product IDs to their details
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v1/products/batch",
                json={"productIds": product_ids}
            )
            response.raise_for_status()
            return response.json()
