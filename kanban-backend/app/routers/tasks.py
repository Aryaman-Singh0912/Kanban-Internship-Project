from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas import TaskCreate, TaskResponse, TaskUpdate
from app.utils import get_current_user

router = APIRouter()

@router.post("/", response_model= TaskResponse)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_task = Task(title= task.title, description = task.description, status = task.status, assignee_id = task.assignee_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task
