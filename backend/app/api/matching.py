from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, JobRole, LearningResource
from ..schemas import MatchExplanationRequest, MatchExplanationResponse
from ..services.matching_engine import matching_engine
from ..services.explainability import explainability_engine

router = APIRouter(prefix="/matching", tags=["matching"])

@router.get("/{user_id}")
def get_user_role_matches(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    matches = matching_engine.match_user_to_all_roles(user, db)
    return matches

@router.post("/explain", response_model=MatchExplanationResponse)
def explain_role_match(req: MatchExplanationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    role = db.query(JobRole).filter(JobRole.id == req.role_id).first()
    if not user or not role:
        raise HTTPException(status_code=404, detail="User or Role not found")
    return explainability_engine.explain_match(user, role, db)

@router.get("/gaps/{user_id}/{role_id}")
def get_skill_gaps(user_id: int, role_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    role = db.query(JobRole).filter(JobRole.id == role_id).first()
    if not user or not role:
        raise HTTPException(status_code=404, detail="User or Role not found")

    calc = matching_engine.calculate_match(user, role)
    
    # Enrich gaps with learning resources
    resources = db.query(LearningResource).all()
    gaps_enriched = []
    for g in calc["missing_skills"]:
        matching_res = [
            {
                "id": r.id,
                "title": r.title,
                "provider": r.provider,
                "resource_type": r.resource_type,
                "difficulty": r.difficulty,
                "duration_hours": r.duration_hours,
                "estimated_impact_pct": r.estimated_impact_pct
            } for r in resources if r.skill and r.skill.canonical_name == g["skill_name"]
        ]
        gaps_enriched.append({
            "skill_name": g["skill_name"],
            "importance": g["importance"],
            "required_level": g["required_proficiency"],
            "current_level": "None Demonstrated",
            "gap_severity": "High" if g["importance"] == "required" else "Medium",
            "rationale": f"Core competency essential for success as {role.title}",
            "recommended_resources": matching_res or [{
                "id": 999,
                "title": f"{g['skill_name']} Fast-Track Intensive",
                "provider": "TalentLens Academy",
                "resource_type": "course",
                "difficulty": "Intermediate",
                "duration_hours": 12,
                "estimated_impact_pct": 15
            }]
        })

    return {
        "user_id": user.id,
        "user_name": user.name,
        "role_id": role.id,
        "role_title": role.title,
        "current_match_score": calc["match_score"],
        "target_match_score": min(98, calc["match_score"] + 22),
        "covered_skills": calc["matched_skills"],
        "gaps": gaps_enriched
    }
