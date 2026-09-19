import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base

# Import models so tables are registered with Base
from . import models

# Create tables
Base.metadata.create_all(bind=engine)

# Import routers
from .api import auth, profiles, skills, roles, matching, simulation, roadmap, assistant, hr, feedback, resume

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profiles.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(roles.router, prefix=settings.API_V1_STR)
app.include_router(matching.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(assistant.router, prefix=settings.API_V1_STR)
app.include_router(hr.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)
app.include_router(resume.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": "TalentLens API",
        "tagline": "Discover Talent. Unlock Potential. Connect Opportunity.",
        "status": "online",
        "mode": "Enhanced AI Mode" if settings.AI_API_KEY else "Local Mode",
        "docs": "/api/docs"
    }

@app.get("/api/status")
def get_system_status():
    return {
        "status": "healthy",
        "ai_mode": "Enhanced AI Mode" if settings.AI_API_KEY else "Local Mode",
        "offline_ready": True,
        "database": "SQLite Connected",
        "version": "1.0.0-hackathon-gold"
    }
