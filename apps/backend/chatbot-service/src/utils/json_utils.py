"""
Utility functions for handling JSON serialization across the application.
Particularly useful for converting PostgreSQL types like Decimal to JSON-compatible formats.
"""

import json
from decimal import Decimal
import datetime
from typing import Any, Dict, List, Union, Optional

class CustomJSONEncoder(json.JSONEncoder):
    """
    Custom JSON encoder that handles special data types:
    - Decimal -> float
    - datetime -> ISO format string
    - date -> ISO format string
    - set -> list
    """
    def default(self, o: Any) -> Any:
        if isinstance(o, Decimal):
            return float(o)
        elif isinstance(o, datetime.datetime):
            return o.isoformat()
        elif isinstance(o, datetime.date):
            return o.isoformat()
        elif isinstance(o, set):
            return list(o)
        return super(CustomJSONEncoder, self).default(o)

def process_value(value: Any) -> Any:
    """
    Convert a value to a JSON-serializable format.
    This is useful for pre-processing data before serialization.
    """
    if isinstance(value, Decimal):
        return float(value)
    elif isinstance(value, (datetime.datetime, datetime.date)):
        return value.isoformat()
    elif isinstance(value, set):
        return list(value)
    elif isinstance(value, dict):
        return {k: process_value(v) for k, v in value.items()}
    elif isinstance(value, list) or isinstance(value, tuple):
        return [process_value(item) for item in value]
    return value

def json_dumps(obj: Any, **kwargs: Any) -> str:
    """
    Convert an object to a JSON string using the CustomJSONEncoder.
    
    Args:
        obj: The Python object to convert
        **kwargs: Additional arguments to pass to json.dumps
        
    Returns:
        JSON string representation
    """
    kwargs['cls'] = kwargs.get('cls', CustomJSONEncoder)
    return json.dumps(obj, **kwargs)

def process_db_row(row: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process a database row to make all values JSON-serializable.
    
    Args:
        row: A dictionary representing a database row
        
    Returns:
        A dictionary with all values converted to JSON-serializable types
    """
    return {k: process_value(v) for k, v in row.items()}
