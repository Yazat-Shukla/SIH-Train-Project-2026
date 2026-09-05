from datetime import date

from pydantic import BaseModel, Field


class GeneratePlanningRequest(BaseModel):
    planning_date: date
    created_by: str = Field(default="planner", min_length=1, max_length=100)


class ReoptimizeRequest(BaseModel):
    planning_run_id: int = Field(gt=0)
