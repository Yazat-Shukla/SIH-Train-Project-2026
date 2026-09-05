from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models.asset import Asset
from app.schemas.asset import AssetResponse

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.get("", response_model=list[AssetResponse])
def get_assets(db: Session = Depends(get_db)):
    return db.query(Asset).all()


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = (
        db.query(Asset)
        .filter(Asset.asset_id == asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    return asset