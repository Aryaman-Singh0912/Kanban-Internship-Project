from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default="To-Do")
    attachment_url: Mapped[str | None] = mapped_column(String, nullable=True)
    feedback: Mapped[str | None] = mapped_column(String, nullable=True)
    assignee_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    assignee: Mapped["User"] = relationship("User", back_populates="tasks")