from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


'''
Base schema for Journal.
Contains common fields shared across multiple journal schemas.
'''
class JournalBase(BaseModel):
    title: str
    content: Optional[str] = None

'''
Schema used when creating a new journal entry.
Inherits all fields from JournalBase.
'''
class JournalCreate(JournalBase):
    pass

'''
Schema used when updating a journal entry.
All fields are optional because updates can be partial.
'''
class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

'''
Schema used for returning journal data in API responses.
Extends JournalBase and includes database-generated fields.
'''
class JournalRead(JournalBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

'''
Schema used for returning ranked results with highlighted snippets
'''
class JournalSearchResult(BaseModel):
    id: UUID
    title: str
    snippet: Optional[str] = None
    created_at: datetime
    rank: Optional[float] = None

    class Config:
        from_attributes = True