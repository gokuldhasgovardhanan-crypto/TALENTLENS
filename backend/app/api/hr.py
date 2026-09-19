from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import HRTalentOverview
from ..services.hr_analytics import hr_analytics_service

router = APIRouter(prefix="/hr", tags=["hr"])

@router.get("/overview")
def get_hr_overview(db: Session = Depends(get_db)):
    return hr_analytics_service.get_overview(db)

@router.get("/hidden-talent")
def get_hidden_talent(db: Session = Depends(get_db)):
    return hr_analytics_service.get_hidden_talent(db)

@router.get("/skills-heatmap")
def get_skills_heatmap(db: Session = Depends(get_db)):
    return hr_analytics_service.get_skill_heatmap(db)

@router.get("/skill-risks")
def get_skill_risks(db: Session = Depends(get_db)):
    return hr_analytics_service.get_skill_risks(db)

@router.get("/search")
def search_internal_talent(
    query: str = Query("Data Analyst", description="Target role or skills"),
    department: Optional[str] = Query(None),
    min_match: int = Query(50),
    db: Session = Depends(get_db)
):
    return hr_analytics_service.search_internal_talent(
        query=query,
        department=department,
        min_match=min_match,
        db=db
    )
