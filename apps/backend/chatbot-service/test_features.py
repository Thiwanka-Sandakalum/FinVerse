#!/usr/bin/env python3
"""
Test script for FinVerse Chatbot Service new features.

This script tests:
1. Product comparison functionality
2. Product-specific chat functionality
3. Comparison-based chat functionality
4. Product search and discovery
"""

import json
import asyncio
import sys
import os

# Add the src directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from services.product_comparison_service import ProductComparisonService
from services.product_chat_service import ProductChatService
from services.database_service import DatabaseService, get_db
from models.api_models import ProductComparisonRequest

async def test_product_comparison():
    """Test product comparison functionality."""
    print("🔍 Testing Product Comparison Service...")
    
    try:
        comparison_service = ProductComparisonService()
        
        # Get some products from database
        db_service = DatabaseService(get_db())
        all_products = db_service.get_all_products()
        
        if len(all_products) < 2:
            print("❌ Need at least 2 products in database for comparison test")
            return None
        
        # Use first 3 products for comparison
        product_ids = [p['id'] for p in all_products[:3]]
        print(f"📊 Comparing products: {product_ids}")
        
        request = ProductComparisonRequest(product_ids=product_ids)
        comparison, comparison_id = await comparison_service.compare_products(request)
        
        print(f"✅ Comparison generated with ID: {comparison_id}")
        print(f"📈 Compared {len(comparison.products)} products")
        print(f"🔬 Analysis included {len(comparison.comparison_fields)} fields")
        
        if comparison.summary.get('overall_best'):
            best = comparison.summary['overall_best']
            print(f"🏆 Overall best: {best.get('product_name')} ({best.get('wins')}/{best.get('total_criteria')} criteria)")
        
        return comparison_id
        
    except Exception as e:
        print(f"❌ Product comparison test failed: {str(e)}")
        return None

async def test_product_chat(product_id: str):
    """Test product-specific chat functionality."""
    print("💬 Testing Product-Specific Chat Service...")
    
    try:
        chat_service = ProductChatService()
        
        query = "What are the key features and requirements of this product?"
        print(f"❓ Query: {query}")
        
        result = await chat_service.process_product_chat(
            query=query,
            product_id=product_id,
            include_comparison=True
        )
        
        answer, product_context, related_products, sources, query_type, conversation_id, history = result
        
        print(f"✅ Product chat successful")
        print(f"🎯 Query type: {query_type.value}")
        print(f"💬 Conversation ID: {conversation_id}")
        print(f"🔗 Related products found: {len(related_products or [])}")
        print(f"📚 Sources: {len(sources)}")
        print(f"📝 Answer preview: {answer[:200]}..." if len(answer) > 200 else f"📝 Answer: {answer}")
        
        return conversation_id
        
    except Exception as e:
        print(f"❌ Product chat test failed: {str(e)}")
        return None

async def test_comparison_chat(comparison_id: str):
    """Test comparison-based chat functionality."""
    print("🔄 Testing Comparison-Based Chat Service...")
    
    try:
        chat_service = ProductChatService()
        
        query = "Which of these products would be best for someone looking for the lowest interest rate?"
        print(f"❓ Query: {query}")
        
        result = await chat_service.process_comparison_chat(
            query=query,
            comparison_id=comparison_id
        )
        
        answer, comparison_context, recommended_products, sources, conversation_id, history = result
        
        print(f"✅ Comparison chat successful")
        print(f"💬 Conversation ID: {conversation_id}")
        print(f"🎯 Recommended products: {len(recommended_products or [])}")
        print(f"📚 Sources: {len(sources)}")
        print(f"📝 Answer preview: {answer[:200]}..." if len(answer) > 200 else f"📝 Answer: {answer}")
        
        return True
        
    except Exception as e:
        print(f"❌ Comparison chat test failed: {str(e)}")
        return False

def test_product_search():
    """Test product search functionality."""
    print("🔎 Testing Product Search Functionality...")
    
    try:
        db_service = DatabaseService(get_db())
        all_products = db_service.get_all_products()
        
        if not all_products:
            print("❌ No products found in database")
            return False
        
        print(f"✅ Found {len(all_products)} total products")
        
        # Test getting products by type
        first_product_type = all_products[0].get('type', '')
        if first_product_type:
            similar_products = db_service.get_products_by_type(first_product_type)
            print(f"🎯 Found {len(similar_products)} products of type '{first_product_type}'")
        
        # Display sample product info
        sample_product = all_products[0]
        print(f"📋 Sample Product: {sample_product.get('name', 'Unknown')}")
        print(f"🏦 Institution: {sample_product.get('institution', 'Unknown')}")
        print(f"📊 Type: {sample_product.get('type', 'Unknown')}")
        
        return sample_product.get('id')
        
    except Exception as e:
        print(f"❌ Product search test failed: {str(e)}")
        return None

async def run_all_tests():
    """Run all test functions."""
    print("🚀 Starting FinVerse Chatbot Service Tests")
    print("=" * 50)
    
    # Test 1: Product Search
    sample_product_id = test_product_search()
    if not sample_product_id:
        print("❌ Cannot continue without products in database")
        return
    
    print("\n" + "=" * 50)
    
    # Test 2: Product Comparison
    comparison_id = await test_product_comparison()
    
    print("\n" + "=" * 50)
    
    # Test 3: Product Chat
    if sample_product_id:
        conversation_id = await test_product_chat(sample_product_id)
    
    print("\n" + "=" * 50)
    
    # Test 4: Comparison Chat
    if comparison_id:
        await test_comparison_chat(comparison_id)
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed!")

if __name__ == "__main__":
    try:
        asyncio.run(run_all_tests())
    except KeyboardInterrupt:
        print("\n⏹️ Tests interrupted by user")
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
