import re
from typing import List, Dict, Any, Tuple
from ..taxonomy import CANONICAL_SKILLS, SKILL_ALIASES

class SkillEngine:
    def __init__(self):
        self.canonical_map = {s["canonical_name"].lower(): s for s in CANONICAL_SKILLS}
        self.aliases = {k.lower(): v for k, v in SKILL_ALIASES.items()}

    def normalize_skill(self, raw_name: str) -> str:
        """
        Normalizes a raw skill string to its canonical taxonomy name.
        Uses exact match, alias lookup, and clean substring fuzzy normalization.
        """
        cleaned = raw_name.strip().lower()
        
        # 1. Direct alias lookup
        if cleaned in self.aliases:
            return self.aliases[cleaned]
        
        # 2. Direct canonical match
        if cleaned in self.canonical_map:
            return self.canonical_map[cleaned]["canonical_name"]
        
        # 3. Fuzzy substring containment
        for alias_key, canon_name in self.aliases.items():
            if alias_key in cleaned or cleaned in alias_key:
                return canon_name
                
        # Fallback to cleaned title case
        return raw_name.strip().title()

    def extract_and_infer_skills(self, text: str) -> Dict[str, Any]:
        """
        Extracts explicitly mentioned skills from text and infers hidden/transferable skills
        based on domain relationships and demonstrated context.
        """
        text_lower = text.lower()
        extracted_skills = []
        inferred_skills = []
        insights = []

        # Find directly mentioned skills
        detected_names = set()
        for alias_key, canon_name in self.aliases.items():
            # Use regex word boundaries for short tokens like 'js', 'py', 'sql'
            pattern = rf"\b{re.escape(alias_key)}\b"
            if re.search(pattern, text_lower):
                if canon_name not in detected_names:
                    detected_names.add(canon_name)
                    extracted_skills.append({
                        "skill_name": canon_name,
                        "confidence_pct": 92,
                        "evidence_context": f"Identified direct usage in text context matching '{alias_key}'",
                        "is_inferred": False
                    })

        # Infer hidden / transferable skills based on combinatory heuristics
        # 1. Incident Resolution + SQL -> Inferred Data Analysis & Troubleshooting
        if "SQL" in detected_names and ("Customer Support" in detected_names or "Incident Management" in detected_names):
            if "Data Analysis" not in detected_names:
                inferred_skills.append({
                    "skill_name": "Data Analysis",
                    "confidence_pct": 84,
                    "evidence_context": "AI Inferred: Applying SQL queries to investigate operational customer incidents directly demonstrates root-cause data analysis.",
                    "is_inferred": True
                })
                insights.append("Discovered transferable Data Analysis capability from operational query logs and customer incident diagnostics.")

        # 2. Support + Excel -> Inferred Process Optimization
        if "Customer Support" in detected_names and "Excel / Advanced Spreadsheets" in detected_names:
            if "Process Optimization" not in detected_names:
                inferred_skills.append({
                    "skill_name": "Process Optimization",
                    "confidence_pct": 80,
                    "evidence_context": "AI Inferred: Spreadsheet modeling combined with support workflow tracking implies capacity for process streamlining.",
                    "is_inferred": True
                })

        # 3. Machine Learning / Projects in CS -> Inferred Problem Solving & API Integration
        if "Machine Learning" in detected_names or "Python" in detected_names:
            if "Problem Solving" not in detected_names:
                inferred_skills.append({
                    "skill_name": "Problem Solving",
                    "confidence_pct": 88,
                    "evidence_context": "AI Inferred: Building end-to-end algorithmic predictive models demonstrates systematic problem decomposition.",
                    "is_inferred": True
                })

        # 4. Power BI / Tableau -> Inferred Stakeholder Communication
        if ("Power BI" in detected_names or "Tableau" in detected_names) and "Stakeholder Communication" not in detected_names:
            inferred_skills.append({
                "skill_name": "Stakeholder Communication",
                "confidence_pct": 82,
                "evidence_context": "AI Inferred: Building executive BI dashboards requires distilling technical data for non-technical stakeholders.",
                "is_inferred": True
            })

        return {
            "detected_skills": extracted_skills,
            "inferred_skills": inferred_skills,
            "insights": insights
        }

skill_engine = SkillEngine()
