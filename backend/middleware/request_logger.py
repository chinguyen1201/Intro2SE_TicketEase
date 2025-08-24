from fastapi import Request
import logging
import json

logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    
    # Log basic request info
    logger.info(f"🔍 {request.method} {request.url}")
    logger.info(f"📋 Headers: {dict(request.headers)}")
    logger.info(f"🔗 Query Params: {dict(request.query_params)}")
    
    # Read and log request body
    body = b""
    async for chunk in request.stream():
        body += chunk
    
    if body:
        try:
            # Try to parse as JSON
            body_str = body.decode('utf-8')
            logger.info(f"📦 Raw Body: {type(body_str)}")
            logger.info(f"📦 Raw Body: {body_str}")
            
            # Try to parse JSON
            body_json = {}
            try:
                body_json = json.loads(body_str)
                logger.info(f"📦 Parsed JSON Body: {body_json}")
            except json.JSONDecodeError:
                logger.info(f"📦 Body (not JSON): {body_str}")
        except Exception as e:
            logger.error(f"❌ Error reading body: {e}")
    else:
        logger.info("📦 Body: Empty")
    
    # Store the body for the request to use later
    if body:
        try:
            request._body = body
        except Exception as e:
            logger.error(f"❌ Error storing body: {e}")
    
    response = await call_next(request)
    
    logger.info(f"✅ Response Status: {response.status_code}")
    return response