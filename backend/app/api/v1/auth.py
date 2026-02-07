from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...models.user import User
from ...schemas.user import UserCreate, UserRead
from ...core.security import get_password_hash

router = APIRouter()

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    
    existing_usr = db.query(User).filter(User.email == user_in.email).first()
    if existing_usr:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email already in use")

    hashed_password = get_password_hash(user_in.password)

    new_user = User(email=user_in.email, password_hash=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user