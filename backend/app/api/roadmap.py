from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, JobRole, CareerRoadmap
from ..schemas import RoadmapResponse
from ..services.roadmap_generator import roadmap_generator

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.get("/{user_id}", response_model=RoadmapResponse)
def get_user_roadmap(user_id: int, role_id: int = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    target_role = None
    if role_id:
        target_role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not target_role:
        target_role = user.target_role or db.query(JobRole).filter(JobRole.title == "Data Analyst").first()
    if not target_role:
        target_role = db.query(JobRole).first()

    roadmap = roadmap_generator.generate_roadmap(user, target_role, db)
    return roadmap
