from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class ScheduleConflict(Base):
    __tablename__ = "schedule_conflicts"

    conflict_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
    )

    planning_run_id: Mapped[int] = mapped_column(
        ForeignKey(
            "planning_runs.planning_run_id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    task_id: Mapped[str | None] = mapped_column(
        ForeignKey(
            "maintenance_tasks.task_id",
            ondelete="CASCADE",
        ),
        nullable=True,
    )

    train_id: Mapped[str | None] = mapped_column(
        ForeignKey(
            "trains.train_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    block_id: Mapped[str | None] = mapped_column(
        ForeignKey(
            "maintenance_blocks.block_id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    conflict_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    resolved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )
