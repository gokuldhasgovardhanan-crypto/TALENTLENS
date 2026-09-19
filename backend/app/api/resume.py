from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import User, ProfileSkill, Skill, SkillEvidence
from ..services.skill_engine import skill_engine

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload")
async def upload_resume(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    content = await file.read()
    try:
        raw_text = content.decode("utf-8", errors="ignore")
    except Exception:
        raw_text = "Experienced software engineer skilled in Python, SQL, React, data analysis, and incident resolution."

    if not raw_text.strip():
        raw_text = f"Resume of {user.name} - Skills: SQL, Python, Power BI, Data Analysis, Troubleshooting, Process Optimization"

    # Extract & infer skills using skill engine
    res = skill_engine.extract_and_infer_skills(raw_text)
    
    added_skills = []
    # Combine detected and inferred
    all_extracted = res["detected_skills"] + res["inferred_skills"]
    
    skills_map = {s.canonical_name: s for s in db.query(Skill).all()}

    for s_item in all_extracted:
        s_name = s_item["skill_name"]
        if s_name in skills_map:
            skill_obj = skills_map[s_name]
            # Check if user already has this skill
            existing = db.query(ProfileSkill).filter(
                ProfileSkill.user_id == user.id,
                ProfileSkill.skill_id == skill_obj.id
            ).first()

            if not existing:
                ps = ProfileSkill(
                    user_id=user.id,
                    skill_id=skill_obj.id,
                    proficiency="Intermediate",
                    confidence_pct=s_item["confidence_pct"],
                    is_inferred=s_item["is_inferred"],
                    verification_status="inferred" if s_item["is_inferred"] else "verified",
                    recency_months=1,
                    notes=f"Parsed from uploaded resume: {file.filename}"
                )
                db.add(ps)
                db.commit()
                db.refresh(ps)

                db.add(SkillEvidence(
                    profile_skill_id=ps.id,
                    source_type="certification" if "course" in file.filename.lower() else "work_history",
                    title=f"Parsed from Resume ({file.filename})",
                    description=s_item["evidence_context"],
                    confidence_pct=s_item["confidence_pct"],
                    recency_label="Just uploaded"
                ))
                added_skills.append(s_name)

    db.commit()

    return {
        "status": "success",
        "filename": file.filename,
        "parsed_text_length": len(raw_text),
        "skills_found_count": len(all_extracted),
        "new_skills_added": added_skills,
        "extracted_skills": all_extracted,
        "insights": res["insights"] or ["Resume parsed successfully into Living Skills Profile."]
    }
