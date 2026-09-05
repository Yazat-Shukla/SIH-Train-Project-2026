from datetime import date, time

from sqlalchemy import Boolean, Date, ForeignKey, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Train(Base):
    __tablename__ = "trains"

    train_id: Mapped[str] = mapped_column(String(30), primary_key=True)
    train_number: Mapped[str] = mapped_column(String(30), nullable=False)
    train_name: Mapped[str | None] = mapped_column(String(150))
    corridor_id: Mapped[str] = mapped_column(ForeignKey("corridors.corridor_id"), nullable=False)
    service_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    train_type: Mapped[str | None] = mapped_column(String(50))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
