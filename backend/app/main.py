from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.farm import Field, FarmerProfile
from app.routes import land, weather, advice, qa, profile

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FarmTwin AI API: Mobile-first agricultural digital twin for Indian farmers."
)

# Enable CORS for frontend Vite development server & mobile web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(land.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)
app.include_router(advice.router, prefix=settings.API_V1_STR)
app.include_router(qa.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_seed_defaults():
    """Seed initial sample field if database is empty for immediate rich farmer preview."""
    db = SessionLocal()
    try:
        if db.query(Field).count() == 0:
            demo_field = Field(
                name="తూర్పు చేను (East Field)",
                state="Andhra Pradesh",
                district="Guntur",
                village="Prathipadu",
                size="2.5 Acres",
                soil_type="black",
                water_source="borewell",
                assistance_needed="crop_care",
                current_crop="Cotton (పత్తి)",
                crop_stage="vegetative",
                latitude=16.3067,
                longitude=80.4365,
                soil_source="farmer_reported",
                water_source_type="farmer_reported",
                npk_status="measured",
                is_active=True
            )
            db.add(demo_field)
            db.commit()
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FarmTwin AI Backend",
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
