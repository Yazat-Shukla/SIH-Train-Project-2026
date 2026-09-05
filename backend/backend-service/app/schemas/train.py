from datetime import date, time

from pydantic import BaseModel, ConfigDict


class TrainResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    train_id: str
    train_number: str
    train_name: str | None
    corridor_id: str
    service_date: date
    start_time: time
    end_time: time
    train_type: str | None
    is_active: bool