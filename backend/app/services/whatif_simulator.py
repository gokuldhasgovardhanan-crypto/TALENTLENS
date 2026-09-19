from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..models import User, JobRole, WhatIfSimulation
from .matching_engine import matching_engine

class WhatIfSimulator:
    def simulate(
        self,
        user: User,
        target_role: JobRole,
        simulated_skills: List[str],
        simulated_proficiency: str = "Intermediate",
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        """
        Re-executes the real matching algorithm on the target role and across all roles
        to calculate real score deltas and newly unlocked opportunities.
        """
        # Baseline match
        orig_match = matching_engine.calculate_match(user, target_role)
        orig_score = orig_match["match_score"]

        # Projected match with simulated skills
        proj_match = matching_engine.calculate_match(
            user,
            target_role,
            simulated_skill_names=simulated_skills,
            simulated_proficiency=simulated_proficiency
        )
        proj_score = proj_match["match_score"]
        score_delta = max(0, proj_score - orig_score)

        # Check impact on other roles across the company
        unlocked_roles = []
        if db:
            all_roles = db.query(JobRole).all()
            for r in all_roles:
                base_r = matching_engine.calculate_match(user, r)["match_score"]
                proj_r = matching_engine.calculate_match(
                    user,
                    r,
                    simulated_skill_names=simulated_skills,
                    simulated_proficiency=simulated_proficiency
                )["match_score"]

                delta_r = proj_r - base_r
                if delta_r > 0 or proj_r >= 70:
                    status = "Newly Qualified" if base_r < 75 <= proj_r else (
                        "Stronger Candidate" if proj_r >= 80 else "In Reach"
                    )
                    unlocked_roles.append({
                        "role_id": r.id,
                        "role_title": r.title,
                        "department": r.department,
                        "previous_score": base_r,
                        "projected_score": proj_r,
                        "delta": delta_r,
                        "status": status
                    })

            unlocked_roles.sort(key=lambda x: x["projected_score"], reverse=True)

        pathway = f"Complete practical projects in {', '.join(simulated_skills)} to unlock high-confidence readiness for {target_role.title}."

        return {
            "user_id": user.id,
            "target_role_id": target_role.id,
            "target_role_title": target_role.title,
            "original_score": orig_score,
            "projected_score": proj_score,
            "score_delta": score_delta,
            "simulated_skills": simulated_skills,
            "unlocked_roles": unlocked_roles[:5],
            "recommended_pathway": pathway,
            "disclaimer": "Projected model score — not a hiring guarantee."
        }

whatif_simulator = WhatIfSimulator()
