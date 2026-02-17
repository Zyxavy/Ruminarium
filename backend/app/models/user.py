'''
This file defines the User database model

this represents the registered users in the system.

This model uses SQLAlchemy ORM with PostgreSQL UUID support.

'''

import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from ..db.database import Base


#ORM model for the 'users' table.
class User(Base):
    __tablename__ = "users"
    
    #Columns
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    #One to many relationship
    #If a user is deleted, so is all of their journals
    journals = relationship(
    "Journal",
    back_populates="owner",
    cascade="all, delete-orphan"
    )
