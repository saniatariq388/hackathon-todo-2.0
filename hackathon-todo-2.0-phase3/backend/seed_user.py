# backend/seed_user.py
import sys
import os
import uuid
import datetime
from sqlmodel import Session, select

# Backend path setup
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.core.db import engine
from backend.models import User, Session as AuthSession # Session model import kiya

def create_valid_user_and_session():
    email = "postman@test.com"
    print(f"Creating/Checking user: {email}...")
    
    with Session(engine) as session:
        # 1. User Check/Create
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        
        if not user:
            user = User(
                id=str(uuid.uuid4()),
                email=email, 
                name="Postman User",
                emailVerified=True,
                createdAt=datetime.datetime.utcnow(),
                updatedAt=datetime.datetime.utcnow()
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print(f"✅ User created: {user.id}")
        else:
            print(f"ℹ️ User found: {user.id}")

        # 2. Session Create (Zaroori hai Postman ke liye)
        # Hum ek lamba valid token generate karenge
        fake_token = str(uuid.uuid4())
        
        # Check if session exists for this user to avoid duplicates
        existing_session = session.exec(select(AuthSession).where(AuthSession.userId == user.id)).first()
        
        if existing_session:
            # Purana session delete kar dete hain taake naya token mile
            session.delete(existing_session)
            session.commit()

        new_session = AuthSession(
            id=str(uuid.uuid4()),
            userId=user.id,
            token=fake_token,
            expiresAt=datetime.datetime.utcnow() + datetime.timedelta(days=30), # 30 din ki validity
            ipAddress="127.0.0.1",
            userAgent="Postman"
        )
        session.add(new_session)
        session.commit()
        
        print("\n" + "="*60)
        print("🔑 POSTMAN TOKEN (Isay 'Authorization' tab mein Bearer Token mein dalein):")
        print("="*60)
        print(fake_token)
        print("="*60 + "\n")

if __name__ == "__main__":
    create_valid_user_and_session()