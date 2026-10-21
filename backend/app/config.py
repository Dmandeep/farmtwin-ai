import os

class Settings:
    PROJECT_NAME: str = "FarmTwin AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./farmtwin.db")
    ALLOWED_ORIGINS: list[str] = ["*"]

settings = Settings()
