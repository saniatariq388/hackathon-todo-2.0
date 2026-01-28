from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class Account(SQLModel, table=True):
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    accountId: str
    providerId: str
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    idToken: Optional[str] = None
    expiresAt: Optional[datetime] = None
    password: Optional[str] = None
