import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..db.database import Base

'''
Journal model representing the 'journals' table in the database.
Each journal entry belongs to a specific user.
'''
class Journal(Base):
    __tablename__ = "journals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=True)
    owner_id = Column(UUID(as_uuid=True),ForeignKey("users.id"),
        nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),onupdate=func.now())
    owner = relationship("User", back_populates="journals")
