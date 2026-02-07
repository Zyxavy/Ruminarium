from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from ...core.security import verify_password, create_access_token
from ...schemas.token import Token
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

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    
    user = db.query(User).filter(User.email == form_data.username).first()
    verified_pass = verify_password(form_data.password, user.password_hash)

    if not user or not verified_pass:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Unauthorized access!")
    
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }