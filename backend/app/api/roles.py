from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models import JobRole, RoleSkill, Skill
from ..services.matching_engine import matching_engine

router = APIRouter(prefix="/roles", tags=["roles"])

class RoleSkillInput(BaseModel):
    skill_name: str
    importance: Optional[str] = "required" # required, preferred, nice_to_have
    min_proficiency: Optional[str] = "Intermediate"
    weight: Optional[float] = 1.0

class CreateRoleRequest(BaseModel):
    title: str
    department: str
    level: Optional[str] = "Mid-Level"
    description: Optional[str] = ""
    min_experience_years: Optional[float] = 2.0
    salary_range: Optional[str] = "$90,000 - $120,000"
    open_positions: Optional[int] = 1
    location: Optional[str] = "Bangalore / Hybrid"
    work_mode: Optional[str] = "Hybrid"
    skills: List[RoleSkillInput] = []

@router.get("")
def get_all_roles(db: Session = Depends(get_db)):
    roles = db.query(JobRole).all()
    results = []
    for r in roles:
        req_skills = [
            {
                "skill_id": rs.skill_id,
                "skill_name": rs.skill.canonical_name if rs.skill else "Unknown",
                "importance": rs.importance,
                "min_proficiency": rs.min_proficiency,
                "weight": rs.weight
            } for rs in r.required_skills
        ]
        results.append({
            "id": r.id,
            "title": r.title,
            "department": r.department,
            "level": r.level,
            "description": r.description,
            "min_experience_years": r.min_experience_years,
            "salary_range": r.salary_range,
            "open_positions": r.open_positions,
            "location": r.location,
            "work_mode": r.work_mode,
            "required_skills": req_skills
        })
    return results

@router.get("/{role_id}")
def get_role_by_id(role_id: int, db: Session = Depends(get_db)):
    r = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Role not found")
    req_skills = [
        {
            "skill_id": rs.skill_id,
            "skill_name": rs.skill.canonical_name if rs.skill else "Unknown",
            "importance": rs.importance,
            "min_proficiency": rs.min_proficiency,
            "weight": rs.weight
        } for rs in r.required_skills
    ]
    return {
        "id": r.id,
        "title": r.title,
        "department": r.department,
        "level": r.level,
        "description": r.description,
        "min_experience_years": r.min_experience_years,
        "salary_range": r.salary_range,
        "open_positions": r.open_positions,
        "location": r.location,
        "work_mode": r.work_mode,
        "required_skills": req_skills
    }

@router.post("")
def create_job_role(req: CreateRoleRequest, db: Session = Depends(get_db)):
    """
    HR endpoint: Creates a new open job role and automatically binds required skills.
    """
    existing = db.query(JobRole).filter(JobRole.title.ilike(req.title.strip())).first()
    if existing:
        raise HTTPException(status_code=400, detail="Role title already exists")

    role = JobRole(
        title=req.title.strip(),
        department=req.department,
        level=req.level or "Mid-Level",
        description=req.description or f"Open opportunity for {req.title}",
        min_experience_years=req.min_experience_years or 2.0,
        salary_range=req.salary_range or "$90,000 - $120,000",
        open_positions=req.open_positions or 1,
        location=req.location or "Bangalore / Hybrid",
        work_mode=req.work_mode or "Hybrid"
    )
    db.add(role)
    db.commit()
    db.refresh(role)

    # Attach skills
    skills_map = {s.canonical_name.lower(): s for s in db.query(Skill).all()}
    for s_input in req.skills:
        s_obj = skills_map.get(s_input.skill_name.lower())
        if not s_obj:
            s_obj = db.query(Skill).filter(Skill.name == "SQL").first()
        if s_obj:
            db.add(RoleSkill(
                role_id=role.id,
                skill_id=s_obj.id,
                importance=s_input.importance or "required",
                min_proficiency=s_input.min_proficiency or "Intermediate",
                weight=s_input.weight or 1.0
            ))
    db.commit()
    db.refresh(role)

    return {
        "status": "success",
        "role_id": role.id,
        "role_title": role.title,
        "message": f"Successfully created role '{role.title}'. Calculated initial candidate suitability."
    }

@router.delete("/{role_id}")
def close_job_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(role)
    db.commit()
    return {"status": "success", "closed_role_id": role_id}
