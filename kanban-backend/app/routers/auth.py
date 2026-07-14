from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas import UserCreate, UserResponse
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from app.utils import create_access_token, get_current_user

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)

    new_user = User(email=user.email, hashed_password= hashed_password, role="employee")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login(user: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.username).first()

    if not existing_user:
        raise HTTPException(status_code=403, detail="Invalid username or password")
    if not pwd_context.verify(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=403, detail="Invalid username or password")
    token = create_access_token(data = {"email": existing_user.email})
    return {"access_token" : token , "token_type": "bearer"}