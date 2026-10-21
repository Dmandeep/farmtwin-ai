from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.farm import FarmerProfile, Field, ChatMessage, AdviceHistory
from app.schemas.farm import ProfileUpdate, ProfileResponse

router = APIRouter(prefix="/profile", tags=["Profile & Settings"])

def get_or_create_profile(db: Session) -> FarmerProfile:
    profile = db.query(FarmerProfile).first()
    if not profile:
        profile = FarmerProfile(
            name="రైతు మిత్రుడు (Farmer)",
            phone="",
            preferred_language="te",
            preferred_unit="acres",
            state="Andhra Pradesh",
            district="Guntur",
            village="",
            alerts_weather=True,
            alerts_crop_stage=True,
            alerts_mandi=False
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    return get_or_create_profile(db)

@router.put("", response_model=ProfileResponse)
def update_profile(profile_in: ProfileUpdate, db: Session = Depends(get_db)):
    profile = get_or_create_profile(db)
    
    update_data = profile_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/reset")
def reset_all_data(db: Session = Depends(get_db)):
    """Reset all fields and messages for shared devices."""
    db.query(Field).delete()
    db.query(ChatMessage).delete()
    db.query(AdviceHistory).delete()
    db.commit()
    return {"status": "success", "message": "All farm data reset successfully."}
