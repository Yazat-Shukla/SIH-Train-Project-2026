from datetime import date, time

from sqlalchemy import Date, ForeignKey, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class MaintenanceBlock(Base):
    __tablename__ = "maintenance_blocks"

    block_id: Mapped[str] = mapped_column(
        String(30),
        primary_key=True,
    )

    corridor_id: Mapped[str] = mapped_column(
        ForeignKey("corridors.corridor_id"),
        nullable=False,
    )

    block_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )