from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.farm import Field
from app.schemas.farm import FieldCreate, FieldUpdate, FieldResponse

router = APIRouter(prefix="/fields", tags=["Fields / My Land"])

@router.get("", response_model=List[FieldResponse])
def get_all_fields(db: Session = Depends(get_db)):
    fields = db.query(Field).order_by(Field.is_active.desc(), Field.id.desc()).all()
    return fields

@router.post("", response_model=FieldResponse, status_code=status.HTTP_201_CREATED)
def create_field(field_in: FieldCreate, db: Session = Depends(get_db)):
    # If this is the first field, make it active
    count = db.query(Field).count()
    is_active = (count == 0)

    # Set initial default crop if choosing advice
    current_crop = field_in.current_crop
    crop_stage = field_in.crop_stage
    if not current_crop and field_in.assistance_needed == "crop_care":
        current_crop = "Cotton"
        crop_stage = "vegetative"

    db_field = Field(
        name=field_in.name or "My Land",
        state=field_in.state,
        district=field_in.district,
        village=field_in.village or "",
        size=field_in.size,
        soil_type=field_in.soil_type,
        water_source=field_in.water_source,
        assistance_needed=field_in.assistance_needed,
        current_crop=current_crop,
        crop_stage=crop_stage,
        latitude=field_in.latitude,
        longitude=field_in.longitude,
        soil_source=field_in.soil_source or "farmer_reported",
        water_source_type=field_in.water_source_type or "farmer_reported",
        npk_status=field_in.npk_status or "not_yet_known",
        is_active=is_active
    )
    db.add(db_field)
    db.commit()
    db.refresh(db_field)
    return db_field

@router.get("/{field_id}", response_model=FieldResponse)
def get_field(field_id: int, db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@router.put("/{field_id}", response_model=FieldResponse)
def update_field(field_id: int, field_in: FieldUpdate, db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    update_data = field_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(field, key, value)
    
    db.commit()
    db.refresh(field)
    return field

@router.delete("/{field_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_field(field_id: int, db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    db.delete(field)
    db.commit()
    
    # If the active field was deleted, make another field active
    remaining = db.query(Field).first()
    if remaining and not any(f.is_active for f in db.query(Field).all()):
        remaining.is_active = True
        db.commit()
    return None

@router.post("/{field_id}/set-active", response_model=FieldResponse)
def set_active_field(field_id: int, db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    db.query(Field).update({Field.is_active: False})
    field.is_active = True
    db.commit()
    db.refresh(field)
    return field
