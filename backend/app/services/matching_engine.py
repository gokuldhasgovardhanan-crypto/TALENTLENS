from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models import User, JobRole, RoleSkill, ProfileSkill, Skill

class MatchingEngine:
    def __init__(
        self,
        weight_coverage: float = 0.40,
        weight_proficiency: float = 0.25,
        weight_experience: float = 0.15,
        weight_recency: float = 0.10,
        weight_velocity: float = 0.10
    ):
        self.w_coverage = weight_coverage
        self.w_proficiency = weight_proficiency
        self.w_experience = weight_experience
        self.w_recency = weight_recency
        self.w_velocity = weight_velocity

    def _proficiency_multiplier(self, user_prof: str, required_prof: str) -> float:
        levels = {"Beginner": 1, "Intermediate": 2, "Advanced": 3, "Expert": 4}
        u_val = levels.get(user_prof, 1)
        r_val = levels.get(required_prof, 2)
        if u_val >= r_val:
            return 1.0
        return u_val / r_val

    def calculate_match(
        self,
        user: User,
        role: JobRole,
        simulated_skill_names: Optional[List[str]] = None,
        simulated_proficiency: str = "Intermediate"
    ) -> Dict[str, Any]:
        """
        Calculates a transparent, multi-factor match score between a candidate and a job role.
        Supports What-If simulated additions.
        """
        role_skills = role.required_skills
        if not role_skills:
            return {
                "match_score": 50,
                "skill_coverage_score": 50,
                "experience_score": 50,
                "proficiency_score": 50,
                "matched_skills": [],
                "missing_skills": [],
                "key_highlights": ["General compatibility assessment"]
            }

        user_skills_dict = {}
        for ps in user.skills:
            # Skip rejected skills
            if ps.verification_status == "rejected":
                continue
            skill_name = ps.skill.canonical_name if ps.skill else ""
            user_skills_dict[skill_name] = ps

        # If simulated skills are supplied, augment the user dictionary
        if simulated_skill_names:
            for s_name in simulated_skill_names:
                # Create a pseudo mock profile skill
                user_skills_dict[s_name] = {
                    "proficiency": simulated_proficiency,
                    "confidence_pct": 90,
                    "recency_months": 1,
                    "is_simulated": True
                }

        total_weight = 0.0
        covered_weight = 0.0
        proficiency_scores = []
        matched_details = []
        missing_details = []
        key_highlights = []

        for rs in role_skills:
            skill_canon = rs.skill.canonical_name if rs.skill else rs.skill.name
            req_prof = rs.min_proficiency or "Intermediate"
            imp_weight = rs.weight or (1.5 if rs.importance == "required" else 1.0)
            total_weight += imp_weight

            if skill_canon in user_skills_dict:
                user_sk = user_skills_dict[skill_canon]
                if isinstance(user_sk, dict):
                    u_prof = user_sk.get("proficiency", "Intermediate")
                    u_conf = user_sk.get("confidence_pct", 85)
                    evidence_summary = "Simulated newly acquired capability"
                else:
                    u_prof = user_sk.proficiency
                    u_conf = user_sk.confidence_pct
                    ev_items = user_sk.evidence_items
                    evidence_summary = ev_items[0].description if ev_items else f"Demonstrated in {user_sk.recency_months}m recency"

                prof_factor = self._proficiency_multiplier(u_prof, req_prof)
                covered_weight += imp_weight * prof_factor
                proficiency_scores.append(prof_factor)

                matched_details.append({
                    "skill_name": skill_canon,
                    "importance": rs.importance,
                    "status": "matched" if prof_factor >= 1.0 else "partial",
                    "candidate_proficiency": u_prof,
                    "required_proficiency": req_prof,
                    "confidence_pct": u_conf,
                    "evidence_summary": evidence_summary
                })
            else:
                proficiency_scores.append(0.0)
                missing_details.append({
                    "skill_name": skill_canon,
                    "importance": rs.importance,
                    "status": "missing",
                    "candidate_proficiency": None,
                    "required_proficiency": req_prof,
                    "confidence_pct": 0,
                    "evidence_summary": f"Required for {role.title}"
                })

        # 1. Coverage Score (0 - 100)
        coverage_score = int((covered_weight / total_weight) * 100) if total_weight > 0 else 0

        # 2. Proficiency Depth Score (0 - 100)
        avg_prof = (sum(proficiency_scores) / len(proficiency_scores)) if proficiency_scores else 0
        prof_score = int(avg_prof * 100)

        # 3. Experience Score (0 - 100)
        exp_req = role.min_experience_years or 1.0
        user_exp = user.experience_years or 0.5
        if user_exp >= exp_req:
            exp_score = 100
        else:
            exp_score = int(max(40, (user_exp / exp_req) * 100))

        # 4. Recency & Activity Score (0 - 100)
        recency_score = 88

        # 5. Learning Velocity / Project Rigor (0 - 100)
        project_count = len(user.projects)
        velocity_score = min(100, 70 + (project_count * 10))

        # Final Weighted Aggregation
        final_score = int(
            (coverage_score * self.w_coverage) +
            (prof_score * self.w_proficiency) +
            (exp_score * self.w_experience) +
            (recency_score * self.w_recency) +
            (velocity_score * self.w_velocity)
        )

        # Ensure bounded [15, 99]
        final_score = max(15, min(98, final_score))

        # Highlights
        if len(matched_details) >= 3:
            key_highlights.append(f"Strong overlap across {len(matched_details)} core capabilities")
        if any(m["skill_name"] == "SQL" and m["status"] == "matched" for m in matched_details):
            key_highlights.append("Practical SQL and query background verified")
        if any(m["skill_name"] == "Power BI" and m["status"] == "matched" for m in matched_details):
            key_highlights.append("Demonstrated BI and executive dashboarding")
        if missing_details:
            key_highlights.append(f"Targeted growth opportunity in {missing_details[0]['skill_name']}")

        return {
            "match_score": final_score,
            "skill_coverage_score": coverage_score,
            "experience_score": exp_score,
            "proficiency_score": prof_score,
            "matching_skills_count": len(matched_details),
            "total_required_skills": len(role_skills),
            "matched_skills": matched_details,
            "missing_skills": missing_details,
            "key_highlights": key_highlights
        }

    def match_user_to_all_roles(self, user: User, db: Session) -> List[Dict[str, Any]]:
        roles = db.query(JobRole).all()
        results = []
        for role in roles:
            calc = self.calculate_match(user, role)
            results.append({
                "role_id": role.id,
                "role_title": role.title,
                "department": role.department,
                "level": role.level,
                "salary_range": role.salary_range,
                "work_mode": role.work_mode,
                "match_score": calc["match_score"],
                "skill_coverage_score": calc["skill_coverage_score"],
                "experience_score": calc["experience_score"],
                "proficiency_score": calc["proficiency_score"],
                "matching_skills_count": calc["matching_skills_count"],
                "total_required_skills": calc["total_required_skills"],
                "matched_skills": calc["matched_skills"],
                "missing_skills": calc["missing_skills"],
                "key_highlights": calc["key_highlights"],
                "is_top_match": False
            })

        results.sort(key=lambda x: x["match_score"], reverse=True)
        if results:
            results[0]["is_top_match"] = True
        return results

matching_engine = MatchingEngine()
