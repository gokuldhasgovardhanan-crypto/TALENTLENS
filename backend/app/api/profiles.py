from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ProfileSkill, SkillEvidence, Project
from ..schemas import UserProfileDetail, ProfileSkillSchema

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("/{user_id}")
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    skills_data = []
    for ps in user.skills:
        if ps.verification_status == "rejected":
            continue
        ev_items = [
            {
                "id": ev.id,
                "profile_skill_id": ev.profile_skill_id,
                "source_type": ev.source_type,
                "title": ev.title,
                "description": ev.description,
                "url": ev.url,
                "confidence_pct": ev.confidence_pct,
                "recency_label": ev.recency_label,
                "date_recorded": ev.date_recorded
            } for ev in ps.evidence_items
        ]
        skills_data.append({
            "id": ps.id,
            "user_id": ps.user_id,
            "skill_id": ps.skill_id,
            "skill_name": ps.skill.name if ps.skill else "Unknown",
            "canonical_name": ps.skill.canonical_name if ps.skill else "Unknown",
            "category": ps.skill.category if ps.skill else "Technical",
            "cluster": ps.skill.cluster if ps.skill else "General",
            "proficiency": ps.proficiency,
            "confidence_pct": ps.confidence_pct,
            "is_inferred": ps.is_inferred,
            "verification_status": ps.verification_status,
            "recency_months": ps.recency_months,
            "notes": ps.notes,
            "evidence_items": ev_items
        })

    projects_data = [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "role_performed": p.role_performed,
            "tech_stack": p.tech_stack,
            "outcome": p.outcome,
            "start_date": p.start_date,
            "end_date": p.end_date
        } for p in user.projects
    ]

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar": user.avatar,
        "user_type": user.user_type,
        "current_title": user.current_title,
        "department": user.department,
        "experience_years": user.experience_years,
        "career_stage": user.career_stage,
        "bio": user.bio,
        "completeness_pct": user.completeness_pct,
        "location": user.location,
        "target_role_id": user.target_role_id,
        "target_role_title": user.target_role.title if user.target_role else "Data Analyst",
        "skills": skills_data,
        "projects": projects_data
    }

@router.put("/{user_id}")
def update_user_profile(user_id: int, payload: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    for k, v in payload.items():
        if hasattr(user, k):
            setattr(user, k, v)

    db.commit()
    db.refresh(user)
    return {"status": "success", "user_id": user.id}
