'''
Journal routes handling all CRUD operations for journal entries.
- POST / - Create a new journal entry
- GET / - List all journals for current user 
- GET /{journal_id} - Get a specific journal
- PATCH /{journal_id} - Update a journal
- DELETE /{journal_id} - Delete a journal

All routes require authentication via get_current_user dependency.
'''

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...services import journal_services
from ...schemas.journal import JournalCreate, JournalRead, JournalUpdate
from ...api.deps import get_current_user
from ...db.database import get_db

router = APIRouter()

'''
Create a new journal entry for the authenticated user.
Returns the created journal entry with generated ID and timestamps.
'''
@router.post("/", response_model=JournalRead, status_code=status.HTTP_201_CREATED)
def create_entry(journal_in: JournalCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return journal_services.create_journal(db=db, journal_in=journal_in, owner_id=current_user.id)

'''
Retrieve all journal entries for the authenticated user.
Returns a list of journal entries sorted by creation date
'''
@router.get("/", response_model=List[JournalRead])
def read_entries(skip: int = 0, limit: int = 100, 
                 db: Session = Depends(get_db),
                 current_user = Depends(get_current_user)):
    return journal_services.get_journals(db=db, owner_id=current_user.id, skip=skip, limit=limit)

'''
Get a specific journal entry by ID, returns the journal entry if found and owned by the current user.
Raises 404 error if entry doesn't exist or doesn't belong to the user.
'''
@router.get("/{journal_id}", response_model=JournalRead)
def read_entries(journal_id: UUID, db: Session = Depends(get_db),current_user = Depends(get_current_user)):
    journal = journal_services.get_journal(db=db, journal_id=journal_id, owner_id=current_user.id)

    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found",
        ) 
    
    return journal

'''
Update a journal entry. Only provided fields will be updated. Returns the updated entry.
Raises 404 if entry doesn't exist or doesn't belong to the user.
'''
@router.patch("/{journal_id}", response_model=JournalRead)
def update_entry(journal_id: UUID, journal_in: JournalUpdate, 
                db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_journal = journal_services.update_journal(db=db, journal_id=journal_id,
                                                owner_id=current_user.id, journal_in=journal_in)
    
    if not db_journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Journal entry not found")
    
    return db_journal

'''
Returns the deleted entry data.
Raises 404 if entry doesn't exist or doesn't belong to the user.
'''
@router.delete("/{journal_id}", response_model=JournalRead)
def delete_entry(journal_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_journal = journal_services.delete_journal(db=db, journal_id=journal_id, owner_id=current_user.id)

    if not db_journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Journal entry not found")
    
    return db_journal