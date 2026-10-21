from pydantic import BaseModel, Field as PField
from typing import Optional, List, Any
from datetime import datetime

class FieldBase(BaseModel):
    name: Optional[str] = "My Land"
    state: str
    district: str
    village: Optional[str] = ""
    size: str
    soil_type: str
    water_source: str
    assistance_needed: Optional[str] = "choose_crop"
    current_crop: Optional[str] = None
    crop_stage: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    soil_source: Optional[str] = "farmer_reported"
    water_source_type: Optional[str] = "farmer_reported"
    npk_status: Optional[str] = "not_yet_known"

class FieldCreate(FieldBase):
    pass

class FieldUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    size: Optional[str] = None
    soil_type: Optional[str] = None
    water_source: Optional[str] = None
    assistance_needed: Optional[str] = None
    current_crop: Optional[str] = None
    crop_stage: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    soil_source: Optional[str] = None
    water_source_type: Optional[str] = None
    npk_status: Optional[str] = None

class FieldResponse(FieldBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    name: str = "Farmer"
    phone: Optional[str] = ""
    preferred_language: str = "te"
    preferred_unit: str = "acres"
    state: str = "Andhra Pradesh"
    district: str = "Guntur"
    village: Optional[str] = ""
    alerts_weather: bool = True
    alerts_crop_stage: bool = True
    alerts_mandi: bool = False

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None
    preferred_unit: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    alerts_weather: Optional[bool] = None
    alerts_crop_stage: Optional[bool] = None
    alerts_mandi: Optional[bool] = None

class ProfileResponse(ProfileBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class StructuredAdviceResponse(BaseModel):
    short_answer: str
    practical_steps: List[str]
    why: str
    cautions: List[str]
    sources: List[str]

class CropRecommendationRequest(BaseModel):
    field_id: Optional[int] = None
    state: Optional[str] = None
    district: Optional[str] = None
    soil_type: Optional[str] = None
    water_source: Optional[str] = None
    language: str = "te"

class CropCareRequest(BaseModel):
    field_id: Optional[int] = None
    crop_name: str
    growth_stage: str
    soil_type: Optional[str] = None
    district: Optional[str] = None
    language: str = "te"

class CropDiagnosisRequest(BaseModel):
    crop_name: str
    symptoms: str
    district: Optional[str] = None
    language: str = "te"

class AskQuestionRequest(BaseModel):
    session_id: Optional[str] = "default"
    question: str
    language: str = "te"
    field_id: Optional[int] = None
    crop_context: Optional[str] = None
