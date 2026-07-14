from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers import auth
from app.utils import get_current_user
from app.models.user import User
from app.schemas import UserResponse

app = FastAPI()
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/me", response_model=UserResponse)
def get_me(current_user : User = Depends(get_current_user)):
    return current_user

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"message" : "database connection works"}

@app.get("/")
def read_root():
    return {"message": "hello world"}