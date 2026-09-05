from datetime import date

from pydantic import BaseModel, ConfigDict


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    task_id: str
    asset_id: int | None
    department_id: int
    corridor_id: str
    task_type: str | None
    description: str | None
    criticality: float
    severity: float
    asset_importance: float
    train_impact: float
    overdue_days: int
    historical_failures: int
    duration_minutes: int
    due_date: date | None
    status: str