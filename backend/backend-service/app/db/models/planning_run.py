from datetime import date, datetime, time

from sqlalchemy import BigInteger, Date, DateTime, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class PlanningRun(Base):
    __tablename__ = "planning_runs"

    planning_run_id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
    )

    planning_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    planning_start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    planning_end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="CREATED",
    )

    model_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    created_by: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
