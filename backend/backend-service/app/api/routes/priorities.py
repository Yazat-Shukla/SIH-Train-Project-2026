from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.priority_service import (
    get_tasks_for_priority,
    prepare_priority_features,
)

router = APIRouter(
    prefix="/priorities",
    tags=["Priorities"],
)


@router.get("")
def get_priorities(db: Session = Depends(get_db)):
    tasks = get_tasks_for_priority(db)

    result = []

    for task in tasks:
        result.append(
            {
                "task_id": task.task_id,
                "features": prepare_priority_features(task),
            }
        )

    return result