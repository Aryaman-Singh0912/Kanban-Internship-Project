from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas import TaskCreate, TaskResponse, TaskUpdate
from app.utils import get_current_user
from app.schemas import TaskDecline

router = APIRouter()

@router.post("/", response_model= TaskResponse)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_task = Task(title= task.title, description = task.description, status = task.status, assignee_id = task.assignee_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@router.get("/", response_model=list[TaskResponse])
def get_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == 'admin':
        tasks = db.query(Task).all()
        return tasks
    else:
        tasks = db.query(Task).filter(Task.assignee_id == current_user.id).all()
        return tasks
    

@router.get("/{task_id}", response_model=TaskResponse)
def get_one_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")
    if current_user.role != 'admin' and current_user.id != task.assignee_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access another user's tasks")
    return task

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")
    if current_user.role != 'admin' and current_user.id != task.assignee_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access another user's tasks")

    if task_data.title is not None:
        task.title = task_data.title

    if task_data.description is not None:
        task.description = task_data.description

    if task_data.assignee_id is not None:
        if current_user.role != 'admin':
            raise HTTPException(status_code=403, detail="You do not have permission to change assignee ids.")
        task.assignee_id = task_data.assignee_id

    if task_data.status is not None:
        task.status = task_data.status

    if task_data.feedback is not None:
        if current_user.role != 'admin':
            raise HTTPException(status_code=403, detail="You are not allowed to add feedback to your own task.")
        task.feedback = task_data.feedback

    if task_data.attachment_url is not None:
        task.attachment_url = task_data.attachment_url

    db.commit()
    db.refresh(task)
    return task
    
@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):

    if current_user.role == 'employee':
        raise HTTPException(status_code=403, detail="Not allowed to delete own tasks")
    
    deleted_task = db.query(Task).filter(Task.id == task_id).first()

    if deleted_task is None:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(deleted_task)
    db.commit()

@router.patch("/{task_id}/approve", response_model=TaskResponse)
def approve_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")

    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can approve tasks")

    task.status = "Approved"

    db.commit()
    db.refresh(task)
    return task

@router.patch("/{task_id}/decline", response_model=TaskResponse)
def decline_task(task_id: int, declined_task: TaskDecline, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found!")

    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can decline tasks")

    task.status = "In Progress"
    task.feedback = declined_task.feedback

    db.commit()
    db.refresh(task)
    return task