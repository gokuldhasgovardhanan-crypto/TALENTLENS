import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from ..models import User, JobRole
from ..config import settings
from .matching_engine import matching_engine
from .explainability import explainability_engine
from .whatif_simulator import whatif_simulator

class AssistantService:
    def __init__(self):
        self.response_cache = {}

    def process_message(
        self,
        user_id: int,
        message: str,
        conversation_history: List[Any],
        db: Session
    ) -> Dict[str, Any]:
        cache_key = f"{user_id}:{message.strip().lower()}"
        if cache_key in self.response_cache:
            return self.response_cache[cache_key]

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {
                "reply": "I couldn't locate your user profile. Please select a demo user to proceed.",
                "intent_detected": "unknown",
                "suggested_actions": ["Select Demo User", "Explore Roles"]
            }

        msg_lower = message.lower()
        target_role = user.target_role or db.query(JobRole).filter(JobRole.title == "Data Analyst").first()

        # 1. Intent: Roles that fit skills
        if any(w in msg_lower for w in ["fit", "roles match", "opportunities", "what can i apply", "suitable roles"]):
            matches = matching_engine.match_user_to_all_roles(user, db)
            top_3 = matches[:3]
            roles_text = "\n".join([f"• **{m['role_title']}** ({m['department']}) — **{m['match_score']}% Match**" for m in top_3])
            reply = (
                f"Based on your living skills profile, here are your top role matches right now:\n\n"
                f"{roles_text}\n\n"
                f"Your strongest demonstrated capabilities in **{', '.join([s.skill.canonical_name for s in user.skills[:3]])}** "
                f"give you immediate competitive leverage."
            )
            res = {
                "reply": reply,
                "intent_detected": "role_matching",
                "suggested_actions": ["Why this match?", "Simulate Skill Growth", "Generate Career Roadmap"],
                "data_references": {"top_matches": top_3}
            }
            self.response_cache[cache_key] = res
            return res

        # 2. Intent: Skill gaps / What am I missing
        if any(w in msg_lower for w in ["missing", "skill gap", "gap", "need to learn", "prerequisite"]):
            if not target_role:
                target_role = db.query(JobRole).first()
            match = matching_engine.calculate_match(user, target_role)
            missing = match["missing_skills"]
            missing_text = "\n".join([f"• **{g['skill_name']}** (Required Level: {g['required_proficiency']})" for g in missing])
            reply = (
                f"For the **{target_role.title}** role, here are the key skills you currently need to bridge:\n\n"
                f"{missing_text if missing else 'You currently meet all core required skills!'}\n\n"
                f"Bridging these via the **What-If Simulator** will unlock a projected match score of **85%+**."
            )
            res = {
                "reply": reply,
                "intent_detected": "skill_gaps",
                "suggested_actions": [f"Simulate +{missing[0]['skill_name']}" if missing else "View Roadmap", "Check Learning Resources"],
                "data_references": {"target_role": target_role.title, "gaps": missing}
            }
            self.response_cache[cache_key] = res
            return res

        # 3. Intent: Why was I recommended this role / Evidence
        if any(w in msg_lower for w in ["why", "evidence", "explain", "recommendation reason"]):
            if not target_role:
                target_role = db.query(JobRole).first()
            exp = explainability_engine.explain_match(user, target_role, db)
            strengths_text = "\n".join([f"• **{s['skill_name']}**: {s['evidence_rationale']}" for s in exp["strengths_evidence"][:3]])
            reply = (
                f"**Why TalentLens Recommends {target_role.title}:**\n\n"
                f"{exp['executive_summary']}\n\n"
                f"**Verified Evidence from Your Profile:**\n"
                f"{strengths_text}\n\n"
                f"💡 *{exp['growth_potential_rationale']}*"
            )
            res = {
                "reply": reply,
                "intent_detected": "explainability",
                "suggested_actions": ["Explore Roadmap", "What-If Simulator"],
                "data_references": {"explanation": exp}
            }
            self.response_cache[cache_key] = res
            return res

        # 4. Intent: What should I learn first / Roadmap / Next step
        if any(w in msg_lower for w in ["learn first", "next step", "roadmap", "project", "build"]):
            match = matching_engine.calculate_match(user, target_role)
            missing = match["missing_skills"]
            top_gap = missing[0]["skill_name"] if missing else "Advanced Data Architecture"
            reply = (
                f"🎯 **Your Recommended Immediate Step:**\n\n"
                f"1. **Primary Focus**: Learn **{top_gap}** (Estimated 3-4 weeks to Intermediate level).\n"
                f"2. **Hands-on Project**: Build a customer telemetry or incident-to-analytics dashboard integrating SQL + {top_gap}.\n"
                f"3. **Internal Gig**: Engage in cross-functional shadowing with the {target_role.department} team."
            )
            res = {
                "reply": reply,
                "intent_detected": "learning_guidance",
                "suggested_actions": ["Open What-If Simulator", "View Full Roadmap", "Browse Roles"],
                "data_references": {"top_focus": top_gap}
            }
            self.response_cache[cache_key] = res
            return res

        # Default fallback / conversational career intelligence
        reply = (
            f"Hello {user.name}! I am your TalentLens Career Intelligence Assistant. "
            f"I have evaluated your profile ({user.current_title or 'Candidate'}, {len(user.skills)} verified/inferred skills).\n\n"
            f"Here is what you can ask me:\n"
            f"• *'Which roles fit my current skills?'*\n"
            f"• *'What skills am I missing for Data Analyst?'*\n"
            f"• *'Why was I recommended this role?'*\n"
            f"• *'What should I learn first?'*\n"
            f"• *'What career paths can I transition into?'*"
        )
        res = {
            "reply": reply,
            "intent_detected": "general_guidance",
            "suggested_actions": ["Which roles fit me?", "What skills am I missing?", "Why this match?"]
        }
        self.response_cache[cache_key] = res
        return res

assistant_service = AssistantService()
