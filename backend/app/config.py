import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Compute absolute path to root/backend database file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)

db_path = os.path.join(BASE_DIR, "talentlens.db")
if not os.path.exists(db_path):
    db_path = os.path.join(ROOT_DIR, "talentlens.db")

DEFAULT_DB_URL = f"sqlite:///{db_path.replace('\\', '/')}"

class Settings(BaseModel):
    PROJECT_NAME: str = "TalentLens Backend"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", DEFAULT_DB_URL)
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini") # gemini | openai | local
    APP_ENV: str = os.getenv("APP_ENV", "development")

settings = Settings()
