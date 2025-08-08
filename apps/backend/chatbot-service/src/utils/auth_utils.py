"""
Authentication utilities for JWT token handling.
"""

import jwt
import logging
from typing import Dict, Any, Optional
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

logger = logging.getLogger(__name__)

# Security scheme for JWT Bearer token
security = HTTPBearer()

class AuthUtils:
    """Utilities for handling authentication and JWT tokens."""
    
    @staticmethod
    def decode_jwt(token: str) -> Dict[str, Any]:
        """
        Decode a JWT token without verification (we're just extracting the user ID).
        
        Args:
            token: The JWT token string
            
        Returns:
            Decoded token payload
            
        Raises:
            ValueError: If token cannot be decoded
        """
        try:
            # Decode without verification since we're just extracting user info
            # In a production system, you'd want to properly verify the token
            decoded_token = jwt.decode(token, options={"verify_signature": False})
            return decoded_token
        except Exception as e:
            logger.error(f"Failed to decode JWT token: {str(e)}")
            raise ValueError(f"Invalid token format: {str(e)}")
    
    @staticmethod
    def extract_user_id(token: str) -> Optional[str]:
        """
        Extract the user ID from a JWT token.
        
        Args:
            token: The JWT token string
            
        Returns:
            User ID (sub claim) or None if not found
        """
        try:
            decoded = AuthUtils.decode_jwt(token)
            return decoded.get("sub")
        except Exception as e:
            logger.error(f"Failed to extract user ID from token: {str(e)}")
            return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Get the current authenticated user from the request.
    
    Args:
        credentials: The HTTP Authorization credentials
        
    Returns:
        Dictionary with user information
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        token = credentials.credentials
        decoded_token = AuthUtils.decode_jwt(token)
        
        # Ensure we have a user ID
        if not decoded_token.get("sub"):
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token: Missing user ID"
            )
        
        return {
            "user_id": decoded_token.get("sub"),
            "token_data": decoded_token
        }
    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )

def get_user_id_from_request(request: Request) -> Optional[str]:
    """
    Extract user ID from request's Authorization header without failing if missing.
    
    Args:
        request: The FastAPI request object
        
    Returns:
        User ID or None if not found/valid
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
            
        # Extract token from "Bearer <token>"
        if " " not in auth_header:
            return None
            
        scheme, token = auth_header.split(" ", 1)
        if scheme.lower() != "bearer":
            return None
            
        return AuthUtils.extract_user_id(token)
    except Exception as e:
        logger.error(f"Error extracting user ID from request: {str(e)}")
        return None
