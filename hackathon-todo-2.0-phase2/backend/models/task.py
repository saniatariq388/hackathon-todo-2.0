from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel, Column, DateTime, func

if TYPE_CHECKING:
    from .user import User

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    status: str = Field(default="pending")
    user_id: str = Field(foreign_key="user.id")
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    )

    user: "User" = Relationship(back_populates="tasks")