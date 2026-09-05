from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.schedule import ScheduleAssignment
from app.schemas.planning import GeneratePlanningRequest
from app.schemas.schedule import ScheduleResponse
from app.services.optimization_service import generate_plan

router = APIRouter(prefix="/schedules", tags=["Schedules"])


@router.get("", response_model=list[ScheduleResponse])
def get_schedules(db: Session = Depends(get_db)):
    return db.query(ScheduleAssignment).all()


@router.get("/{planning_run_id}", response_model=list[ScheduleResponse])
def get_schedule(
    planning_run_id: str,
    db: Session = Depends(get_db),
):
    return (
        db.query(ScheduleAssignment)
        .filter(
            ScheduleAssignment.planning_run_id == planning_run_id
        )
        .all()
    )


@router.post("/planning/generate")
def generate_schedule(
    request: GeneratePlanningRequest,
    db: Session = Depends(get_db),
):
    return generate_plan(
        db=db,
        planning_date=request.planning_date,
        created_by=request.created_by,
    )
