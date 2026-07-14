from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key = True, index = True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default="To-Do")
    attachment_url = Column(String, nullable=True)
    feedback = Column(String, nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=False)

