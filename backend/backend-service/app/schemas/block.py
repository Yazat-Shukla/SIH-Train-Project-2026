from datetime import date, time

from pydantic import BaseModel, ConfigDict


class BlockResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    block_id: str
    corridor_id: str
    block_date: date
    start_time: time
    end_time: time
    status: str
    description: str | None