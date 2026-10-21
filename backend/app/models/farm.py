from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from datetime import datetime
from app.database import Base

class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="My Land")
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    village = Column(String(100), nullable=True)
    size = Column(String(50), nullable=False) # e.g. "1-2 Acres" or "2.5 Acres"
    soil_type = Column(String(50), nullable=False) # "red", "black", "sandy", "clay"
    water_source = Column(String(50), nullable=False) # "rain", "borewell", "canal", "well", "drip"
    assistance_needed = Column(String(100), nullable=True) # "choose_crop", "crop_care", "soil_advice", "problem"
    current_crop = Column(String(100), nullable=True) # e.g. "Cotton", "Paddy", "Chilli"
    crop_stage = Column(String(100), nullable=True) # "sowing", "vegetative", "flowering", "fruiting", "harvest"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Transparency metadata (Farmer reported vs System measured vs Estimated)
    soil_source = Column(String(50), default="farmer_reported")
    water_source_type = Column(String(50), default="farmer_reported")
    npk_status = Column(String(50), default="not_yet_known")
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Farmer")
    phone = Column(String(20), default="")
    preferred_language = Column(String(10), default="te") # "te", "en", "hi"
    preferred_unit = Column(String(20), default="acres") # "acres", "gunthas", "cents", "hectares"
    state = Column(String(100), default="Andhra Pradesh")
    district = Column(String(100), default="Guntur")
    village = Column(String(100), default="")
    
    alerts_weather = Column(Boolean, default=True)
    alerts_crop_stage = Column(Boolean, default=True)
    alerts_mandi = Column(Boolean, default=False)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdviceHistory(Base):
    __tablename__ = "advice_history"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, nullable=True)
    advice_type = Column(String(50)) # "choose_crop", "crop_care", "diagnosis", "soil"
    crop_name = Column(String(100), nullable=True)
    language = Column(String(10), default="te")
    title = Column(String(200))
    structured_content = Column(JSON) # { "short_answer": ..., "practical_steps": [...], "why": ..., "cautions": [...], "sources": [...] }
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True)
    role = Column(String(20)) # "user" or "assistant"
    language = Column(String(10), default="te")
    content = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=True)
    structured_content = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
