from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class TaskPriorityPrediction(Base):
    __tablename__ = "task_priority_predictions"

    prediction_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
    )

    task_id: Mapped[str] = mapped_column(
        String(30),
        ForeignKey(
            "maintenance_tasks.task_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    priority_score: Mapped[float] = mapped_column(
        Numeric(6, 2),
        nullable=False,
    )

    priority_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    predicted_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )
