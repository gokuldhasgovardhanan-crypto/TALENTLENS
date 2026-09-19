from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ProfileSkill, Skill, SkillEvidence, JobRole
from ..schemas import SkillExtractRequest, SkillExtractResponse, SkillVerifyRequest
from ..services.skill_engine import skill_engine

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/taxonomy")
def get_skill_taxonomy(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return skills

@router.post("/extract", response_model=SkillExtractResponse)
def extract_skills_from_text(req: SkillExtractRequest):
    result = skill_engine.extract_and_infer_skills(req.text)
    return result

@router.post("/verify")
def verify_or_confirm_skill(req: SkillVerifyRequest, db: Session = Depends(get_db)):
    profile_skill = db.query(ProfileSkill).filter(ProfileSkill.id == req.profile_skill_id).first()
    if not profile_skill:
        raise HTTPException(status_code=404, detail="Profile skill not found")

    if req.action == "confirm":
        profile_skill.verification_status = "confirmed"
        profile_skill.confidence_pct = min(100, profile_skill.confidence_pct + 10)
    elif req.action == "reject":
        profile_skill.verification_status = "rejected"
    elif req.action == "update_proficiency" and req.proficiency:
        profile_skill.proficiency = req.proficiency
        profile_skill.verification_status = "confirmed"

    db.commit()
    db.refresh(profile_skill)
    return {
        "status": "success",
        "profile_skill_id": profile_skill.id,
        "verification_status": profile_skill.verification_status,
        "confidence_pct": profile_skill.confidence_pct
    }

@router.get("/graph/{user_id}")
def get_user_skill_graph(user_id: int, db: Session = Depends(get_db)):
    """
    Generates node-link data structure for the interactive skill graph:
    Nodes: Person, Projects, Skills (Core & Inferred), and Target Roles.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    nodes = []
    links = []

    # Center Node: Person
    nodes.append({
        "id": f"user_{user.id}",
        "name": user.name,
        "type": "person",
        "title": user.current_title,
        "category": "Person",
        "size": 35
    })

    # Project Nodes
    for p in user.projects:
        p_id = f"proj_{p.id}"
        nodes.append({
            "id": p_id,
            "name": p.title,
            "type": "project",
            "category": "Project Evidence",
            "size": 22,
            "description": p.description
        })
        links.append({
            "source": f"user_{user.id}",
            "target": p_id,
            "label": "Built / Executed"
        })

    # Skill Nodes
    for ps in user.skills:
        if ps.verification_status == "rejected":
            continue
        s = ps.skill
        if not s:
            continue
        s_id = f"skill_{s.id}"
        nodes.append({
            "id": s_id,
            "name": s.canonical_name,
            "type": "inferred_skill" if ps.is_inferred else "core_skill",
            "category": s.category,
            "cluster": s.cluster,
            "proficiency": ps.proficiency,
            "confidence_pct": ps.confidence_pct,
            "is_inferred": ps.is_inferred,
            "size": 26 if not ps.is_inferred else 24,
            "evidence": [ev.description for ev in ps.evidence_items]
        })
        
        # Link from person or project
        if ps.evidence_items and ps.evidence_items[0].source_type == "project" and user.projects:
            links.append({
                "source": f"proj_{user.projects[0].id}",
                "target": s_id,
                "label": "Demonstrated via"
            })
        else:
            links.append({
                "source": f"user_{user.id}",
                "target": s_id,
                "label": "Verified Skill" if not ps.is_inferred else "AI Inferred"
            })

    # Target Role Nodes (e.g. Data Analyst, BI Analyst)
    target_roles = db.query(JobRole).limit(3).all()
    for tr in target_roles:
        r_id = f"role_{tr.id}"
        nodes.append({
            "id": r_id,
            "name": tr.title,
            "type": "role",
            "category": "Target Opportunity",
            "department": tr.department,
            "size": 30
        })
        # Link matching skills to role
        for rs in tr.required_skills:
            matching_s_node = f"skill_{rs.skill_id}"
            if any(n["id"] == matching_s_node for n in nodes):
                links.append({
                    "source": matching_s_node,
                    "target": r_id,
                    "label": "Satisfies Requirement"
                })

    return {"nodes": nodes, "links": links}
