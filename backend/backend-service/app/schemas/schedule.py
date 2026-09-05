from datetime import datetime

from pydantic import BaseModel


class ScheduleAssignmentResponse(BaseModel):
    schedule_id: int
    task_id: str
    block_id: str
    scheduled_start: datetime
    scheduled_end: datetime
    priority_score: float
    status: str


class ScheduleResponse(BaseModel):
    planning_run_id: int
    status: str
    assignments: list[ScheduleAssignmentResponse]
    conflicts: list[dict]


class GeneratePlanningRequest(BaseModel):
    planning_date: str | None = None
    created_by: str = "api"