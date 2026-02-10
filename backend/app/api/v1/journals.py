from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ...services import journal_services
from ...schemas.journal import JournalCreate, JournalRead, JournalUpdate
from ...api.deps import get_current_user
from ...db.database import get_db

router = APIRouter()

@router.post("/", response_model=JournalRead, status_code=status.HTTP_201_CREATED)
def create_entry(journal_in: JournalCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return journal_services.create_journal(db=db, journal_in=journal_in, owner_id=current_user.id)

@router.get("/", response_model=List[JournalRead])
def read_entries(skip: int = 0, limit: int = 100, 
                 db: Session = Depends(get_db),
                 current_user = Depends(get_current_user)):
    return journal_services.get_journals(db=db, owner_id=current_user.id, skip=skip, limit=limit)

@router.get("/{journal_id}", response_model=JournalRead)
def read_entries(journal_id: UUID, db: Session = Depends(get_db),current_user = Depends(get_current_user)):
    journal = journal_services.get_journal(db=db, journal_id=journal_id, owner_id=current_user.id)

    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found",
        ) 
    
    return journal

@router.patch("/{journal_id}", response_model=JournalRead)
def update_entry(journal_id: UUID, journal_in: JournalUpdate, 
                db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_journal = journal_services.update_journal(db=db, journal_id=journal_id,
                                                owner_id=current_user.id, journal_in=journal_in)
    
    if not db_journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Journal entry not found")
    
    return db_journal

@router.delete("/{journal_id}", response_model=JournalRead)
def delete_entry(journal_id: UUID, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_journal = journal_services.delete_journal(db=db, journal_id=journal_id, owner_id=current_user.id)

    if not db_journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Journal entry not found")
    
    return db_journal