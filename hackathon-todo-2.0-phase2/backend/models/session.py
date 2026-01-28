from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class Session(SQLModel, table=True):
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    token: str
    expiresAt: datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
