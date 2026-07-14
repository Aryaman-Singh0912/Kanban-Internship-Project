from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str

    class Config: 
        from_attributes = True

class TaskCreate(BaseModel):
    title: str 
    description: Optional[str] = None
    assignee_id: int 
    status: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[int] = None
    status: Optional[str] = "To-Do"
    feedback: Optional[str] = None
    attachment_url: Optional[str] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    attachment_url: Optional[str]
    feedback: Optional[str]
    assignee_id: int
    class Config:
        from_attributes = True

