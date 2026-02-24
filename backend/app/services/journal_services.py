'''
Provides CRUD operations for journal entries
- Create new journal entries
- Retrieve journals with pagination
- Get single journal by ID
- Update existing journals
- Delete journals
All operations are scoped to the authenticated user (owner_id)
'''

from sqlalchemy.orm import Session
from sqlalchemy import text
from uuid import UUID

from ..models.journal import Journal
from ..schemas.journal import JournalCreate, JournalUpdate


'''
Create a new journal entry.
- Converts Pydantic schema to dictionary
- Assigns the journal to the given owner_id
- Saves to the database
'''
def create_journal(db: Session, journal_in: JournalCreate, owner_id: UUID):
    db_journal = Journal(**journal_in.model_dump(), owner_id = owner_id)

    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

'''
Retrieve multiple journals for a specific user.
- Filters by owner_id to enforce data isolation
- Supports pagination using skip and limit
'''
def get_journals(db: Session, owner_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(Journal).filter(Journal.owner_id == owner_id).offset(skip).limit(limit).all()

'''
Retrieve a single journal by ID.
- Ensures journal belongs to the requesting user
- Prevents unauthorized access to other users' journals
'''
def get_journal(db: Session, journal_id: UUID, owner_id: UUID):
    return db.query(Journal).filter(Journal.id == journal_id, 
                                    Journal.owner_id == owner_id).first()

'''
Update an existing journal entry.
- First verifies ownership
- Supports partial updates
- Returns None if journal not found
'''
def update_journal(db: Session, journal_id: UUID, owner_id: UUID, journal_in: JournalUpdate):
    db_journal = get_journal(db, journal_id=journal_id, owner_id=owner_id)
    if not db_journal:
        return None
    
    update_data = journal_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_journal, field, value)

    db.commit()
    db.refresh(db_journal)
    return db_journal

'''
Delete a journal entry.
- Verifies ownership before deletion
- Returns None if journal not found
'''
def delete_journal(db: Session, journal_id: UUID, owner_id: UUID):
    db_journal = get_journal(db, journal_id=journal_id, owner_id=owner_id)
    if not db_journal:
        return None
    
    db.delete(db_journal)
    db.commit()
    return db_journal

'''
Searches for a journal.
- Relevant results appear first
- Generates Highlighted snippets
'''

def search_journals(db: Session, owner_id: UUID, q: str, skip: int = 0, limit: int = 100):
    
    sql = text("""
        SELECT id, title,
               ts_rank(search_vector, plainto_tsquery('english', :query)) AS rank,
               ts_headline(content, plainto_tsquery('english', :query)) AS snippet,
               created_at
        FROM journals
        WHERE search_vector @@ plainto_tsquery('english', :query)
        AND owner_id = :user_id
        ORDER BY rank DESC
        OFFSET :skip
        LIMIT :limit
    """)

    results = db.execute(sql, {
        "query": q,
        "user_id": str(owner_id),
        "skip": skip,
        "limit": limit
    }).fetchall()

    return results