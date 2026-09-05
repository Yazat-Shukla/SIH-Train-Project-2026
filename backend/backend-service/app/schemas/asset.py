from datetime import date

from pydantic import BaseModel, ConfigDict


class AssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    asset_id: int
    asset_code: str
    asset_name: str
    asset_type: str | None
    department_id: int
    corridor_id: str
    location: str | None
    importance_score: float | None
    status: str
    commissioned_date: date | None
    is_active: bool