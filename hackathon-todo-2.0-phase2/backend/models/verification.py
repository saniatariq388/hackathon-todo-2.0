from datetime import datetime
from sqlmodel import Field, SQLModel

class Verification(SQLModel, table=True):
    id: str = Field(primary_key=True)
    identifier: str
    value: str
    expiresAt: datetime
