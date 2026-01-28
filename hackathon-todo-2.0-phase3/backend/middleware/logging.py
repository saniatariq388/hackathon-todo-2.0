# backend/middleware/logging.py
from fastapi import Request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    logger.info(f"\n{'='*60}")
    logger.info(f"🔵 REQUEST: {request.method} {request.url.path}")
    logger.info(f"Headers: {dict(request.headers)}")
    
    response = await call_next(request)
    
    logger.info(f"✅ RESPONSE: Status {response.status_code}")
    logger.info(f"{'='*60}\n")
    
    return response