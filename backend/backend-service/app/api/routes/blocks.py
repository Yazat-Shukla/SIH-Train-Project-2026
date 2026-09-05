from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.block import MaintenanceBlock
from app.schemas.block import BlockResponse

router = APIRouter(prefix="/blocks", tags=["Maintenance Blocks"])


@router.get("", response_model=list[BlockResponse])
def get_blocks(db: Session = Depends(get_db)):
    return db.query(MaintenanceBlock).all()