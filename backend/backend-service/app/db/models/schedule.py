from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class ScheduleAssignment(Base):
    __tablename__ = "schedule_assignments"

    schedule_id: Mapped[int] = mapped_column(
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

    task_id: Mapped[str] = mapped_column(
        ForeignKey("maintenance_tasks.task_id"),
        nullable=False,
    )

    block_id: Mapped[str] = mapped_column(
        ForeignKey("maintenance_blocks.block_id"),
        nullable=False,
    )

    scheduled_start: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    scheduled_end: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    priority_score: Mapped[float] = mapped_column(
        Numeric(6, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    planner_approved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )