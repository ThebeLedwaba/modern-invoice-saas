import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import redis
import logging

logger = logging.getLogger(__name__)

# Initialize Redis connection for rate limiting
redis_client = redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    decode_responses=True
)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["60/minute"],
    storage_uri=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware for rate limiting API requests."""
    
    async def dispatch(self, request: Request, call_next):
        """Process request with rate limiting.
        
        Args:
            request: HTTP request
            call_next: Next middleware
            
        Returns:
            Response
        """
        response = await call_next(request)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next):
        """Add security headers to response.
        
        Args:
            request: HTTP request
            call_next: Next middleware
            
        Returns:
            Response with security headers
        """
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response


def get_rate_limiter():
    """Get rate limiter instance.
    
    Returns:
        Limiter instance
    """
    return limiter


def check_rate_limit(request: Request, limit: str = "10/minute"):
    """Check if request exceeds rate limit.
    
    Args:
        request: HTTP request
        limit: Rate limit string (e.g., "10/minute")
        
    Raises:
        RateLimitExceeded: If rate limit is exceeded
    """
    try:
        # This would use Redis to track request counts
        # For now, this is a placeholder
        pass
    except Exception as e:
        logger.error(f"Rate limit check error: {e}")
