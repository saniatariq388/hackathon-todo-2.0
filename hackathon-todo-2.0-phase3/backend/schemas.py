# backend\schemas.py
from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"  # low, medium, high
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# User Schemas
class UserRead(BaseModel):
    id: str
    email: str
    name: str
    image: Optional[str] = None
    emailVerified: bool
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
