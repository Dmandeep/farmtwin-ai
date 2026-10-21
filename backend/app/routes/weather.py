from fastapi import APIRouter, Query
from typing import Optional
from app.services.weather_service import fetch_weather

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/current")
async def get_current_weather(
    district: Optional[str] = Query("Guntur", description="District name"),
    lat: Optional[float] = Query(None, description="Field Latitude"),
    lon: Optional[float] = Query(None, description="Field Longitude")
):
    weather_data = await fetch_weather(district=district, lat=lat, lon=lon)
    return weather_data

@router.get("/alerts")
async def get_weather_alerts(
    district: Optional[str] = Query("Guntur")
):
    weather_data = await fetch_weather(district=district)
    return {
        "district": weather_data["district"],
        "alerts": weather_data.get("alerts", []),
        "spray_condition": weather_data.get("spray_condition", "ideal"),
        "spray_message": weather_data.get("spray_message", "")
    }
