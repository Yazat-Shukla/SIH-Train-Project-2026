from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.train import Train
from app.schemas.train import TrainResponse

router = APIRouter(prefix="/trains", tags=["Trains"])


@router.get("", response_model=list[TrainResponse])
def get_trains(db: Session = Depends(get_db)):
    return db.query(Train).all()