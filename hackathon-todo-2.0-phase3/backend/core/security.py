# backend/core/security.py
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session as DBSession, select

from backend.core.db import engine
from backend.models import User, Session as AuthSession

reusable_oauth2 = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)) -> User:
    """
    Validate the session token from Better Auth and return the user.
    
    Args:
        token: Bearer token from Authorization header
        
    Returns:
        User object if valid session
        
    Raises:
        HTTPException: 401 if token is invalid or expired
    """
    print(f"🔐 AUTH CHECK")
    print(f"Token received: {token.credentials}")
    
    with DBSession(engine) as session:
        try:
            # Look up the token in the Session table (Better Auth sessions)
            statement = select(AuthSession).where(AuthSession.token == token.credentials)
            auth_session = session.exec(statement).first()
            
            print(f"Session found: {auth_session is not None}")
            
            # Validation: Check if session exists
            if not auth_session:
                print("❌ Session not found in database")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid session token",
                )
            
            # Check if session is expired
            if auth_session.expiresAt < datetime.utcnow():
                print("❌ Session expired")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session expired",
                )
            
            # Fetch the associated User
            user = session.get(User, auth_session.userId)
            if not user:
                print("❌ User not found")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found",
                )
            
            print(f"✅ User authenticated: {user.email}")
            return user
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication failed",
            )