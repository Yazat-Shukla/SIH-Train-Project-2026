from pydantic import BaseModel, Field


class ReoptimizeRequest(BaseModel):
    planning_run_id: int = Field(gt=0)