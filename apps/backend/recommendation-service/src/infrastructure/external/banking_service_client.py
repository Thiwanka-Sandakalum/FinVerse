"""
HTTP client for external product service.
"""
import logging
from typing import Any, Dict, List

import httpx

from ...domain.repositories.repository_interfaces import ProductRepositoryInterface
from ...shared.exceptions.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class BankingServiceClient(ProductRepositoryInterface):
    """HTTP client for banking service product data."""
    
    def __init__(self, base_url: str, timeout: int = 30) -> None:
        """
        Initialize the banking service client.
        
        Args:
            base_url: Base URL for the banking service
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    async def get_product_details(
        self, 
        product_id: str
    ) -> Dict[str, Any] | None:
        """Get details for a single product."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/api/products/{product_id}")
                
                if response.status_code == 404:
                    return None
                
                response.raise_for_status()
                return response.json()
                
        except httpx.RequestError as e:
            logger.error(f"Request error getting product {product_id}: {str(e)}")
            raise ExternalServiceError(
                f"Failed to get product details for {product_id}",
                {"product_id": product_id, "error": str(e)}
            )
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error getting product {product_id}: {e.response.status_code}")
            raise ExternalServiceError(
                f"HTTP error getting product {product_id}",
                {"product_id": product_id, "status_code": e.response.status_code}
            )
    
    async def get_product_details_batch(
        self, 
        product_ids: List[str]
    ) -> Dict[str, Dict[str, Any]]:
        """Get details for multiple products in a single call."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                # Use batch endpoint if available, otherwise fall back to individual requests
                batch_response = await self._try_batch_request(client, product_ids)
                if batch_response is not None:
                    return batch_response
                
                # Fall back to individual requests
                return await self._get_products_individually(client, product_ids)
                
        except Exception as e:
            logger.error(f"Error getting batch product details: {str(e)}")
            # Return fallback data for all products
            return self._create_fallback_products(product_ids)
    
    async def _try_batch_request(
        self, 
        client: httpx.AsyncClient, 
        product_ids: List[str]
    ) -> Dict[str, Dict[str, Any]] | None:
        """Try to get products using batch endpoint."""
        try:
            response = await client.post(
                f"{self.base_url}/api/products/batch",
                json={"product_ids": product_ids}
            )
            
            if response.status_code == 404:
                # Batch endpoint not available
                return None
            
            response.raise_for_status()
            data = response.json()
            
            # Ensure the response is in the expected format
            if isinstance(data, dict):
                return data
                
            # Convert list format to dict if necessary
            if isinstance(data, list):
                return {item.get("id", ""): item for item in data if "id" in item}
                
            return None
            
        except (httpx.HTTPStatusError, KeyError):
            # Batch endpoint not available or invalid response
            return None
    
    async def _get_products_individually(
        self, 
        client: httpx.AsyncClient, 
        product_ids: List[str]
    ) -> Dict[str, Dict[str, Any]]:
        """Get products using individual requests."""
        results = {}
        
        for product_id in product_ids:
            try:
                response = await client.get(f"{self.base_url}/api/products/{product_id}")
                
                if response.status_code == 200:
                    product_data = response.json()
                    results[product_id] = product_data
                elif response.status_code == 404:
                    # Product not found, create fallback
                    results[product_id] = self._create_fallback_product(product_id)
                else:
                    response.raise_for_status()
                    
            except Exception as e:
                logger.warning(f"Error getting product {product_id}: {str(e)}")
                results[product_id] = self._create_fallback_product(product_id)
        
        return results
    
    def _create_fallback_products(
        self, 
        product_ids: List[str]
    ) -> Dict[str, Dict[str, Any]]:
        """Create fallback product data for all products."""
        return {
            product_id: self._create_fallback_product(product_id) 
            for product_id in product_ids
        }
    
    def _create_fallback_product(self, product_id: str) -> Dict[str, Any]:
        """Create fallback product data for a single product."""
        return {
            "id": product_id,
            "name": f"Product {product_id}",
            "category": "Unknown",
            "description": "Product details unavailable",
            "availability": "unknown"
        }