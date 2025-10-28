"""
Test the ProductComparisonService implementation.
"""

import asyncio
import unittest
from unittest.mock import MagicMock, patch

from src.services.product_comparison_service import ProductComparisonService
from src.services.database_service import DatabaseService


class TestProductComparisonService(unittest.TestCase):
    """Test cases for the ProductComparisonService."""

    def setUp(self):
        """Set up the test case."""
        self.db_service = MagicMock(spec=DatabaseService)
        self.service = ProductComparisonService(self.db_service)
        
        # Sample product data for testing
        self.products = [
            {
                "id": "1",
                "name": "Premium Savings",
                "institution": "ABC Bank",
                "type": "Savings Account",
                "interest_rate": 1.5,
                "annual_percentage_rate": 1.5,
                "features": ["No monthly fee", "Online banking", "Mobile app"],
                "requirements": ["Minimum balance $100", "ID verification"],
            },
            {
                "id": "2",
                "name": "Super Saver",
                "institution": "XYZ Bank",
                "type": "Savings Account",
                "interest_rate": 1.75,
                "annual_percentage_rate": 1.75,
                "features": ["Unlimited withdrawals", "Joint account option"],
                "requirements": ["Minimum balance $500", "Direct deposit"],
            },
        ]
        
        # Mock database query response
        self.db_service.execute_query.return_value = self.products

    def test_get_products_by_ids(self):
        """Test getting products by IDs."""
        product_ids = ["1", "2"]
        result = self.service.get_products_by_ids(product_ids)
        
        self.db_service.execute_query.assert_called_once()
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["name"], "Premium Savings")
        self.assertEqual(result[1]["name"], "Super Saver")

    def test_compare_products(self):
        """Test the compare_products method."""
        product_ids = ["1", "2"]
        comparison = self.service.compare_products(product_ids)
        
        self.assertEqual(comparison["product_type"], "Savings Account")
        self.assertEqual(len(comparison["products"]), 2)
        self.assertIn("interest_rate_comparison", comparison)
        self.assertEqual(comparison["interest_rate_comparison"]["Premium Savings"], 1.5)
        self.assertEqual(comparison["interest_rate_comparison"]["Super Saver"], 1.75)

    def test_basic_comparison_summary(self):
        """Test the _generate_basic_comparison method."""
        product_ids = ["1", "2"]
        comparison = self.service.compare_products(product_ids)
        summary = self.service._generate_basic_comparison(comparison)
        
        self.assertIn("# Comparison of 2 Savings Accounts", summary)
        self.assertIn("Premium Savings", summary)
        self.assertIn("Super Saver", summary)
        self.assertIn("### Key Financial Terms", summary)
        self.assertIn("### Features", summary)
        self.assertIn("### Requirements", summary)
        self.assertIn("No monthly fee", summary)
        self.assertIn("Unlimited withdrawals", summary)

    @patch('google.generativeai.generative_models.GenerativeModel.generate_content')
    def test_generate_comparison_summary_with_llm_success(self, mock_generate_content):
        """Test the generate_comparison_summary method with successful LLM response."""
        # Mock LLM response
        mock_response = MagicMock()
        mock_response.text = "# AI-Generated Comparison\n\nThis is a detailed comparison of the products..."
        mock_generate_content.return_value = mock_response
        
        # Convert async to sync for testing
        product_ids = ["1", "2"]
        comparison = self.service.compare_products(product_ids)
        
        # Run the async function in the event loop
        summary = asyncio.run(self.service.generate_comparison_summary(comparison))
        
        self.assertIn("AI-Generated Comparison", summary)
        mock_generate_content.assert_called_once()

    @patch('google.generativeai.generative_models.GenerativeModel.generate_content')
    def test_generate_comparison_summary_with_llm_failure(self, mock_generate_content):
        """Test the generate_comparison_summary method with LLM failure."""
        # Mock LLM exception
        mock_generate_content.side_effect = Exception("API Error")
        
        # Convert async to sync for testing
        product_ids = ["1", "2"]
        comparison = self.service.compare_products(product_ids)
        
        # Run the async function in the event loop
        summary = asyncio.run(self.service.generate_comparison_summary(comparison))
        
        # Should fall back to basic comparison
        self.assertIn("# Comparison of 2 Savings Accounts", summary)
        self.assertIn("Premium Savings", summary)
        self.assertIn("Super Saver", summary)


if __name__ == "__main__":
    unittest.main()
