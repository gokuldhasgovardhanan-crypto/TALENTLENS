from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import JobRole, RoleSkill

router = APIRouter(prefix="/roles", tags=["roles"])

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
