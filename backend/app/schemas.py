from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth / User
class DemoLoginRequest(BaseModel):
    user_id: int

class UserBase(BaseModel):
    id: int
    name: str
    email: str
    avatar: Optional[str] = None
    user_type: str
    current_title: str
    department: str
    experience_years: float
    career_stage: str
    bio: str
    completeness_pct: int
    location: str
    target_role_id: Optional[int] = None

    class Config:
        from_attributes = True

# Evidence & Skills
class SkillEvidenceSchema(BaseModel):
    id: int
    profile_skill_id: int
    source_type: str
    title: str
    description: str
    url: Optional[str] = ""
    confidence_pct: int
    recency_label: str
    date_recorded: datetime

    class Config:
        from_attributes = True

class ProfileSkillSchema(BaseModel):
    id: int
    user_id: int
    skill_id: int
    skill_name: str
    canonical_name: str
    category: str
    cluster: str
    proficiency: str
    confidence_pct: int
    is_inferred: bool
    verification_status: str
    recency_months: int
    notes: Optional[str] = ""
    evidence_items: List[SkillEvidenceSchema] = []

    class Config:
        from_attributes = True

class UserProfileDetail(UserBase):
    skills: List[ProfileSkillSchema] = []
    projects: List[Dict[str, Any]] = []

class SkillVerifyRequest(BaseModel):
    profile_skill_id: int
    action: str # "confirm", "reject", "update_proficiency"
    proficiency: Optional[str] = None

class SkillExtractRequest(BaseModel):
    text: str

class SkillExtractResponse(BaseModel):
    detected_skills: List[Dict[str, Any]]
    inferred_skills: List[Dict[str, Any]]
    insights: List[str]

# Roles & Matching
class RoleSkillSchema(BaseModel):
    skill_id: int
    skill_name: str
    importance: str
    min_proficiency: str
    weight: float

class JobRoleSchema(BaseModel):
    id: int
    title: str
    department: str
    level: str
    description: str
    min_experience_years: float
    salary_range: str
    open_positions: int
    location: str
    work_mode: str
    required_skills: List[RoleSkillSchema] = []

    class Config:
        from_attributes = True

class MatchSkillDetail(BaseModel):
    skill_name: str
    importance: str
    status: str # "matched", "partial", "missing"
    candidate_proficiency: Optional[str] = None
    required_proficiency: str
    confidence_pct: int = 0
    evidence_summary: Optional[str] = None

class RoleMatchResult(BaseModel):
    role_id: int
    role_title: str
    department: str
    level: str
    salary_range: str
    work_mode: str
    match_score: int # 0-100
    skill_coverage_score: int
    experience_score: int
    proficiency_score: int
    matching_skills_count: int
    total_required_skills: int
    matched_skills: List[MatchSkillDetail]
    missing_skills: List[MatchSkillDetail]
    key_highlights: List[str]
    is_top_match: bool = False

class MatchExplanationRequest(BaseModel):
    user_id: int
    role_id: int

class MatchExplanationResponse(BaseModel):
    role_title: str
    match_score: int
    executive_summary: str
    strengths_evidence: List[Dict[str, Any]]
    critical_gaps: List[Dict[str, Any]]
    growth_potential_rationale: str
    recommended_immediate_action: str

# Skill Gap Analysis
class SkillGapItem(BaseModel):
    skill_id: int
    skill_name: str
    importance: str
    current_level: str
    required_level: str
    gap_severity: str # "High", "Medium", "Low"
    rationale: str
    recommended_resources: List[Dict[str, Any]] = []

class SkillGapResponse(BaseModel):
    user_id: int
    user_name: str
    role_id: int
    role_title: str
    current_match_score: int
    target_match_score: int
    covered_skills: List[Dict[str, Any]]
    gaps: List[SkillGapItem]

# What-If Simulation
class WhatIfRequest(BaseModel):
    user_id: int
    target_role_id: int
    simulated_skills: List[str] # skill names e.g. ["Python", "Statistics"]
    simulated_proficiency: Optional[str] = "Intermediate"

class UnlockedRole(BaseModel):
    role_id: int
    role_title: str
    department: str
    previous_score: int
    projected_score: int
    delta: int
    status: str # "Newly Qualified", "Stronger Candidate", "In Reach"

class WhatIfResponse(BaseModel):
    user_id: int
    target_role_id: int
    target_role_title: str
    original_score: int
    projected_score: int
    score_delta: int
    simulated_skills: List[str]
    unlocked_roles: List[UnlockedRole]
    recommended_pathway: str
    disclaimer: str = "Projected model score — not a hiring guarantee."

# Roadmap
class MilestoneTask(BaseModel):
    title: str
    description: str
    type: str # "learn", "build", "practice", "certify"
    duration: str
    impact_pct: int
    resource_title: Optional[str] = None

class RoadmapMilestone(BaseModel):
    timeframe: str # "0-3 Months", "3-6 Months", "6-12 Months"
    phase_title: str
    focus_skills: List[str]
    tasks: List[MilestoneTask]
    milestone_outcome: str

class RoadmapResponse(BaseModel):
    user_id: int
    user_name: str
    target_role_id: int
    target_role_title: str
    current_compatibility: int
    projected_compatibility: int
    estimated_timeline: str
    milestones: List[RoadmapMilestone]

# Assistant
class AssistantMessage(BaseModel):
    role: str # "user" | "assistant"
    content: str
    created_at: Optional[str] = None

class AssistantRequest(BaseModel):
    user_id: int
    message: str
    conversation_history: List[AssistantMessage] = []

class AssistantResponse(BaseModel):
    reply: str
    intent_detected: str
    suggested_actions: List[str] = []
    data_references: Optional[Dict[str, Any]] = None

# HR Intelligence
class HRTalentOverview(BaseModel):
    total_profiles: int
    verified_skills_count: int
    inferred_skills_count: int
    open_opportunities: int
    internal_mobility_ready: int
    critical_skills_risk_count: int

class HiddenTalentItem(BaseModel):
    user_id: int
    name: str
    avatar: str
    current_role: str
    department: str
    potential_role: str
    potential_role_id: int
    match_score: int
    hidden_skills_evidence: List[str]
    readiness: str # "Ready Now", "Near Ready", "Upskill Potential"

class SkillHeatmapEntry(BaseModel):
    department: str
    skills: Dict[str, int] # skill_name -> count / proficiency average

class SkillRiskItem(BaseModel):
    skill_name: str
    category: str
    employee_count: int
    risk_level: str # "Critical", "Moderate", "Safe"
    impact_description: str

class InternalSearchRequest(BaseModel):
    query: str
    department: Optional[str] = None
    min_match: Optional[int] = 50

# Feedback
class FeedbackCreate(BaseModel):
    user_id: int
    recommendation_type: str # "role", "skill", "roadmap"
    item_id: int
    item_title: str
    is_positive: bool
    feedback_reason: str
    comment: Optional[str] = ""
