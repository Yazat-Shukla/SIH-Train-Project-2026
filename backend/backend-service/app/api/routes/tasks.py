from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.task import MaintenanceTask
from app.schemas.task import TaskResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(MaintenanceTask).all()


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = (
        db.query(MaintenanceTask)
        .filter(MaintenanceTask.task_id == task_id)
        .first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task