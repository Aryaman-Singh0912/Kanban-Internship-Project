from fastapi import FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers import auth


app = FastAPI()
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    return {"message" : "database connection works"}

@app.get("/")
def read_root():
    return {"message": "hello world"}