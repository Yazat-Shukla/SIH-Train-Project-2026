from pydantic import BaseModel


class PriorityResponse(BaseModel):
    task_id: str
    priority_score: float
    priority_level: str
    model_version: str