from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class JournalBase(BaseModel):
    title: str
    content: Optional[str] = None

class JournalCreate(JournalBase):
    pass

class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class JournalRead(JournalBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

