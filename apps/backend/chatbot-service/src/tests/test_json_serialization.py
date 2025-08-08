#!/usr/bin/env python
"""
Test script to verify that JSON serialization works correctly with Decimal objects.
"""

import sys
import json
from decimal import Decimal
from src.utils.json_utils import json_dumps, process_value, CustomJSONEncoder

def test_json_serialization():
    print("Testing JSON serialization with Decimal values...")
    
    # Test various data types including Decimal
    test_data = {
        "name": "Test Product",
        "interest_rate": Decimal("5.75"),
        "loan_amount": Decimal("50000"),
        "features": ["Feature 1", "Feature 2"],
        "nested": {
            "decimal_value": Decimal("123.456"),
            "list_with_decimals": [Decimal("1.1"), Decimal("2.2"), 3]
        }
    }
    
    print("\nOriginal data:")
    print(test_data)
    
    # Try standard JSON serialization (should fail)
    try:
        standard_json = json.dumps(test_data)
        print("\nStandard JSON serialization (should fail but didn't):")
        print(standard_json)
    except TypeError as e:
        print(f"\nStandard JSON serialization failed (expected): {str(e)}")
    
    # Try custom JSON serialization
    try:
        custom_json = json_dumps(test_data)
        print("\nCustom JSON serialization (should succeed):")
        print(custom_json)
        
        # Verify we can parse it back
        parsed = json.loads(custom_json)
        print("\nParsed back from JSON:")
        print(parsed)
        print("\nJSON serialization test passed!")
    except Exception as e:
        print(f"\nCustom JSON serialization failed: {str(e)}")
        return False
    
    # Test process_value function
    processed_data = process_value(test_data)
    print("\nData after processing with process_value():")
    print(processed_data)
    
    # Verify we can serialize the processed data with standard JSON
    try:
        standard_json_after_processing = json.dumps(processed_data)
        print("\nStandard JSON serialization after processing (should succeed):")
        print(standard_json_after_processing)
        print("\nprocess_value() test passed!")
    except Exception as e:
        print(f"\nStandard JSON serialization after processing failed: {str(e)}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_json_serialization()
    sys.exit(0 if success else 1)
