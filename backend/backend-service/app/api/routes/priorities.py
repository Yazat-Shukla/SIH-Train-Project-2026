from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.priority_service import calculate_priorities

router = APIRouter(
    prefix="/priorities",
    tags=["Priorities"],
)


@router.get("")
def get_priorities(db: Session = Depends(get_db)):
    """Calculate and return priority predictions for all maintenance tasks."""
    return calculate_priorities(db)
