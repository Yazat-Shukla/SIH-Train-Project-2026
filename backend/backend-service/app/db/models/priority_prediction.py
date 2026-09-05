from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class TaskPriorityPrediction(Base):
    __tablename__ = "task_priority_predictions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    task_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    priority_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    priority_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )