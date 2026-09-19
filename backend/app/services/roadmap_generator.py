from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models import User, JobRole, LearningResource, Skill
from .matching_engine import matching_engine

class RoadmapGenerator:
    def generate_roadmap(self, user: User, target_role: JobRole, db: Session) -> Dict[str, Any]:
        match = matching_engine.calculate_match(user, target_role)
        current_compat = match["match_score"]
        missing_skills = [m["skill_name"] for m in match["missing_skills"]]
        
        # Pull matching learning resources from database
        resources = db.query(LearningResource).all()
        res_by_skill = {}
        for r in resources:
            s_name = r.skill.canonical_name if r.skill else ""
            if s_name not in res_by_skill:
                res_by_skill[s_name] = []
            res_by_skill[s_name].append(r)

        primary_gaps = missing_skills[:2] if missing_skills else ["Advanced Analytics", "Domain Projects"]
        secondary_gaps = missing_skills[2:4] if len(missing_skills) > 2 else ["Architecture & Optimization"]

        milestones = [
            {
                "timeframe": "0–3 Months",
                "phase_title": "Core Foundations & Bridge Skills",
                "focus_skills": primary_gaps,
                "tasks": [
                    {
                        "title": f"Complete {gap} Foundational Track",
                        "description": f"Master core syntax, data structures, and practical libraries in {gap}.",
                        "type": "learn",
                        "duration": "4 weeks",
                        "impact_pct": 12,
                        "resource_title": res_by_skill.get(gap, [None])[0].title if res_by_skill.get(gap) else f"{gap} Masterclass"
                    } for gap in primary_gaps
                ] + [
                    {
                        "title": f"Build Real-world {target_role.title} Sandbox Project",
                        "description": "Develop a capstone portfolio project addressing a real business dataset.",
                        "type": "build",
                        "duration": "3 weeks",
                        "impact_pct": 15,
                        "resource_title": "Customer Analytics Case Study"
                    }
                ],
                "milestone_outcome": "Demonstrated hands-on proficiency in core missing prerequisite competencies."
            },
            {
                "timeframe": "3–6 Months",
                "phase_title": "Applied Rigor & Internal Gigs",
                "focus_skills": secondary_gaps + [primary_gaps[0]] if primary_gaps else ["Process Automation"],
                "tasks": [
                    {
                        "title": "Cross-Departmental Internal Gig Assignment",
                        "description": f"Shadow an active {target_role.department} team project for 5 hours/week.",
                        "type": "practice",
                        "duration": "6 weeks",
                        "impact_pct": 18,
                        "resource_title": f"Internal {target_role.department} Shadowing Initiative"
                    },
                    {
                        "title": "SQL Query Optimization & Data Pipeline Synthesis",
                        "description": "Refactor existing operational queries for 40% faster execution.",
                        "type": "build",
                        "duration": "3 weeks",
                        "impact_pct": 10,
                        "resource_title": "Production Query Performance Tuning"
                    }
                ],
                "milestone_outcome": "Verified organizational evidence logged in living skills graph."
            },
            {
                "timeframe": "6–12 Months",
                "phase_title": "Role Transition & Candidate Readiness",
                "focus_skills": [target_role.title, "Stakeholder Presentation"],
                "tasks": [
                    {
                        "title": f"Formal {target_role.title} Internal Mobility Application",
                        "description": "Submit updated TalentLens profile with verified evidence to hiring manager.",
                        "type": "certify",
                        "duration": "2 weeks",
                        "impact_pct": 25,
                        "resource_title": "Internal Mobility Fast-Track"
                    }
                ],
                "milestone_outcome": f"Full qualification for {target_role.title} with 90%+ match compatibility."
            }
        ]

        return {
            "user_id": user.id,
            "user_name": user.name,
            "target_role_id": target_role.id,
            "target_role_title": target_role.title,
            "current_compatibility": current_compat,
            "projected_compatibility": min(95, current_compat + 28),
            "estimated_timeline": "6–12 Months",
            "milestones": milestones
        }

roadmap_generator = RoadmapGenerator()
