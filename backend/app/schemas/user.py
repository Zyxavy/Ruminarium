from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional

# What the user sends
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# What the user receives
class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True