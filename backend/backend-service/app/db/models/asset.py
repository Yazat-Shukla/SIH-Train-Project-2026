from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Asset(Base):
    __tablename__ = "assets"

    asset_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    asset_code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    asset_name: Mapped[str] = mapped_column(String(150), nullable=False)
    asset_type: Mapped[str | None] = mapped_column(String(50))
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.department_id"), nullable=False)
    corridor_id: Mapped[str] = mapped_column(ForeignKey("corridors.corridor_id"), nullable=False)
    location: Mapped[str | None] = mapped_column(String(255))
    importance_score: Mapped[float | None] = mapped_column(Numeric(4, 2))
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="AVAILABLE")
    commissioned_date: Mapped[date | None] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)