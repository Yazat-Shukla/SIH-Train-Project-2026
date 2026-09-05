from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"

    task_id: Mapped[str] = mapped_column(
        String(30),
        primary_key=True,
    )

    asset_id: Mapped[int | None] = mapped_column(
        ForeignKey("assets.asset_id"),
        nullable=True,
    )

    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.department_id"),
        nullable=False,
    )

    corridor_id: Mapped[str] = mapped_column(
        ForeignKey("corridors.corridor_id"),
        nullable=False,
    )

    task_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    criticality: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False,
    )

    severity: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False,
    )

    asset_importance: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False,
    )

    train_impact: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False,
    )

    overdue_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    historical_failures: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )