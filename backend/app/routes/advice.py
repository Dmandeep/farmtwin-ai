from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.database import get_db
from app.models.farm import Field, AdviceHistory
from app.schemas.farm import (
    CropRecommendationRequest,
    CropCareRequest,
    CropDiagnosisRequest,
    StructuredAdviceResponse
)
from app.services.agri_knowledge import (
    CROPS_DATABASE,
    STAGE_CARE_GUIDES,
    DIAGNOSIS_RULES
)
from app.services.weather_service import fetch_weather
from app.services.gemini_service import ask_gemini_agri

SOIL_TYPE_MAPPING = {
    # English
    "black": "black",
    "red": "red",
    "clay": "clay",
    "sandy": "sandy",
    # Telugu
    "నల్లరేగడి": "black",
    "నల్ల రేగడి": "black",
    "నల్ల నేల": "black",
    "నల్ల నేలలు": "black",
    "నల్ల": "black",
    "ఎర్ర నేల": "red",
    "ఎర్ర నేలలు": "red",
    "ఎర్ర మట్టి": "red",
    "ఎర్ర": "red",
    "ఇసుక నేల": "sandy",
    "ఇసుక నేలలు": "sandy",
    "ఇసుక గరప": "sandy",
    "ఇసుక": "sandy",
    "గరప": "sandy",
    "బంకమట్టి": "clay",
    "బంక నేల": "clay",
    "బంక నేలలు": "clay",
    "బంక": "clay",
    # Hindi
    "काली": "black",
    "लाल": "red",
    "बलुई": "sandy",
    "चिकनी": "clay",
}

WATER_SOURCE_MAPPING = {
    # English
    "borewell": "borewell",
    "canal": "canal",
    "rain": "rain",
    "well": "well",
    "drip": "drip",
    # Telugu
    "బోరుబావి": "borewell",
    "బోరు బావి": "borewell",
    "బోరు": "borewell",
    "కాలువ నీరు": "canal",
    "కాలువ": "canal",
    "వర్షాధారం": "rain",
    "వర్షం": "rain",
    "బావి నీరు": "well",
    "బావి": "well",
    "బిందుసేద్యం": "drip",
    "బిందు సేద్యం": "drip",
    "డ్రిప్": "drip",
    # Hindi
    "बोरवेल": "borewell",
    "नहर": "canal",
    "बारिश": "rain",
    "कुआं": "well",
    "ड्रिप": "drip",
}

def normalize_soil(soil: Optional[str]) -> str:
    if not soil:
        return "black"
    s = str(soil).strip().lower()
    for k, v in SOIL_TYPE_MAPPING.items():
        if k in s:
            return v
    return s

def normalize_water(water: Optional[str]) -> str:
    if not water:
        return "borewell"
    w = str(water).strip().lower()
    for k, v in WATER_SOURCE_MAPPING.items():
        if k in w:
            return v
    return w

router = APIRouter(prefix="/advice", tags=["Farming Advice"])

@router.post("/recommend-crops")
def recommend_crops(req: CropRecommendationRequest, db: Session = Depends(get_db)):
    soil = req.soil_type
    water = req.water_source
    
    # If field_id is provided, pull parameters from DB
    if req.field_id:
        field = db.query(Field).filter(Field.id == req.field_id).first()
        if field:
            soil = field.soil_type
            water = field.water_source

    soil = normalize_soil(soil)
    water = normalize_water(water)

    # Filter suitable crops
    matching = []
    other = []
    for c in CROPS_DATABASE:
        soil_match = (soil in c["soils"])
        water_match = (water in c["waters"])
        if soil_match and water_match:
            matching.append(c)
        elif soil_match or water_match:
            other.append(c)

    results = matching + other
    if not results:
        results = CROPS_DATABASE[:3]

    return {"crops": results[:4]}

@router.post("/crop-care")
async def get_crop_care(req: CropCareRequest, db: Session = Depends(get_db)):
    crop_key = req.crop_name.strip().lower()
    stage_key = req.growth_stage.strip().lower()
    lang = req.language or "te"

    # Match crop key
    if "cotton" in crop_key or "పత్తి" in crop_key:
        crop_code = "cotton"
    elif "chilli" in crop_key or "మిరప" in crop_key:
        crop_code = "chilli"
    else:
        crop_code = "cotton"

    # Match stage
    if "sow" in stage_key or "మొలక" in stage_key:
        stage_code = "sowing"
    elif "flow" in stage_key or "పూత" in stage_key:
        stage_code = "flowering"
    else:
        stage_code = "vegetative"

    crop_guide = STAGE_CARE_GUIDES.get(crop_code, {}).get(stage_code, STAGE_CARE_GUIDES["cotton"]["vegetative"])

    # Fetch localized weather to sync irrigation tasks
    district = req.district
    if not district and req.field_id:
        field = db.query(Field).filter(Field.id == req.field_id).first()
        if field:
            district = field.district
    district = district or "Guntur"
    weather = await fetch_weather(district=district)
    rain_chance = weather.get("rain_chance", 20)
    wind_speed = weather.get("wind_speed", 10)

    weather_task_en = "Soil moisture is good. Maintain normal watering cycle."
    weather_task_te = "నేలలో తేమ సాధారణంగా ఉంది. సాధారణ పద్ధతిలో తడులు ఇవ్వండి."
    weather_task_hi = "मिट्टी में नमी सामान्य है। नियमित सिंचाई चक्र जारी रखें।"

    if rain_chance > 60:
        weather_task_en = f"Heavy rain ({rain_chance}% chance) expected in {district}. Hold irrigation and fertilizer application today."
        weather_task_te = f"{district} జిల్లాలో భారీ వర్షం ({rain_chance}%) పడే సూచన ఉంది. ఈ రోజు తడులు ఇవ్వడం, ఎరువులు చల్లడం ఆపండి."
        weather_task_hi = f"{district} में भारी बारिश ({rain_chance}%) का अनुमान है। आज सिंचाई और खाद का छिड़काव रोकें।"

    steps = list(crop_guide.get(f"steps_{lang}", crop_guide.get("steps_en", [])))
    if lang == "te":
        steps.insert(0, weather_task_te)
    elif lang == "hi":
        steps.insert(0, weather_task_hi)
    else:
        steps.insert(0, weather_task_en)

    return {
        "title": crop_guide.get(f"title_{lang}", crop_guide.get("title_en")),
        "crop": req.crop_name,
        "stage": req.growth_stage,
        "practical_steps": steps,
        "cautions": crop_guide.get(f"cautions_{lang}", crop_guide.get("cautions_en", [])),
        "weather_sync": {
            "rain_chance": rain_chance,
            "wind_speed": wind_speed,
            "spray_condition": weather.get("spray_condition"),
            "spray_message": weather.get("spray_message")
        },
        "sources": [
            "ANGRAU Vyavasaya Panchangam (2025-26)",
            "PJTSAU Package of Practices for Kharif/Rabi Crops",
            "ICAR Krishi Vigyan Kendra Technical Manual"
        ]
    }

@router.post("/diagnose")
async def diagnose_crop_issue(
    crop_name: str = Form("Cotton"),
    symptoms: str = Form("symYellow"),
    custom_desc: Optional[str] = Form(""),
    district: Optional[str] = Form("Guntur"),
    language: str = Form("te"),
    file: Optional[UploadFile] = File(None)
):
    lang = language or "te"
    
    # Check if a known symptom code was chosen
    if symptoms in DIAGNOSIS_RULES:
        rule = DIAGNOSIS_RULES[symptoms]
        return {
            "title": rule.get(f"title_{lang}", rule.get("title_en")),
            "short_answer": rule.get(f"causes_{lang}", rule.get("causes_en")),
            "practical_steps": rule.get(f"action_{lang}", rule.get("action_en")),
            "why": rule.get(f"causes_{lang}", rule.get("causes_en")),
            "cautions": rule.get(f"cautions_{lang}", rule.get("cautions_en")),
            "sources": [
                "ICAR - Central Institute for Cotton Research (CICR) / CRIDA",
                "ANGRAU Plant Pathology & Entomology Advisory Bulletin",
                "State Department of Agriculture Plant Protection Guidelines"
            ]
        }
    
    # If custom description or uploaded image, pass to Gemini service
    image_bytes = None
    mime_type = "image/jpeg"
    if file:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"

    prompt = f"Crop: {crop_name}. Observed symptoms: {custom_desc or symptoms}. Location: {district}."
    guidance = await ask_gemini_agri(
        prompt=prompt,
        language=lang,
        image_bytes=image_bytes,
        image_mime_type=mime_type,
        field_context=f"District: {district}, Crop: {crop_name}"
    )
    return guidance

@router.get("/latest")
def get_latest_advice(language: str = Query("te")):
    if language == "te":
        return {
            "id": 1,
            "crop": "పత్తి (Cotton)",
            "title": "అధిక తేమ హెచ్చరిక — రసం పీల్చే పురుగుల నివారణ",
            "summary": "గాలిలో తేమ ఎక్కువగా ఉండటం వల్ల పత్తిలో తామర పురుగులు, తెల్లదోమ ఆశించే అవకాశం ఉంది. ఉదయాన్నే వేపనూనె 5 మి.లీ/లీటరు పిచికారీ చేయండి.",
            "link_stage": "flowering"
        }
    elif language == "hi":
        return {
            "id": 1,
            "crop": "कपास (Cotton)",
            "title": "अधिक नमी चेतावनी — रस चूसक कीटों की रोकथाम",
            "summary": "हवा में अधिक नमी के कारण थ्रिप्स का प्रकोप बढ़ सकता है। सुबह के समय 5 मिली/लीटर नीम के तेल का छिड़काव करें।",
            "link_stage": "flowering"
        }
    else:
        return {
            "id": 1,
            "crop": "Cotton",
            "title": "High Humidity Alert — Sucking Pest Protection",
            "summary": "Elevated moisture favors thrips and whiteflies. Spray 5 ml/litre neem oil (1500 ppm) in the early morning.",
            "link_stage": "flowering"
        }
