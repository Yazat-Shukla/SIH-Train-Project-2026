from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import MaintenanceTask


def get_tasks(db: Session) -> list[MaintenanceTask]:
    return list(db.scalars(select(MaintenanceTask).order_by(MaintenanceTask.task_id)).all())


def get_task(db: Session, task_id: str) -> MaintenanceTask | None:
    return db.get(MaintenanceTask, task_id)