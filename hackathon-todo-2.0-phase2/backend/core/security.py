# backend\core\security.py
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session as DBSession, select

from backend.core.db import engine
from backend.models import User, Session as AuthSession

reusable_oauth2 = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(reusable_oauth2)) -> User:
    with DBSession(engine) as session:
        # Look up the token in the AuthSession table
        statement = select(AuthSession).where(AuthSession.token == token.credentials)
        auth_session = session.exec(statement).first()

        # Validation: Check if session exists and is not expired
        if not auth_session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session token",
            )

        if auth_session.expiresAt < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )

        # Fetch the associated User
        user = session.get(User, auth_session.userId)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return user