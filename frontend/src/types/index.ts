export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  user_type: 'candidate' | 'job_seeker' | 'employee' | 'hr_admin';
  current_title: string;
  department: string;
  experience_years: number;
  career_stage: string;
  bio: string;
  completeness_pct: number;
  location: string;
  target_role_id?: number;
  target_role_title?: string;
}

export interface SkillEvidence {
  id: number;
  profile_skill_id: number;
  source_type: string;
  title: string;
  description: string;
  url?: string;
  confidence_pct: number;
  recency_label: string;
  date_recorded: string;
}

export interface ProfileSkill {
  id: number;
  user_id: number;
  skill_id: number;
  skill_name: string;
  canonical_name: string;
  category: string;
  cluster: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  confidence_pct: number;
  is_inferred: boolean;
  verification_status: 'verified' | 'inferred' | 'confirmed' | 'rejected';
  recency_months: number;
  notes?: string;
  evidence_items: SkillEvidence[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  role_performed: string;
  tech_stack: string;
  outcome: string;
  start_date: string;
  end_date: string;
}

export interface UserProfileDetail extends User {
  skills: ProfileSkill[];
  projects: Project[];
}

export interface MatchSkillDetail {
  skill_name: string;
  importance: 'required' | 'preferred' | 'nice_to_have';
  status: 'matched' | 'partial' | 'missing';
  candidate_proficiency?: string;
  required_proficiency: string;
  confidence_pct: number;
  evidence_summary?: string;
}

export interface RoleMatchResult {
  role_id: number;
  role_title: string;
  department: string;
  level: string;
  salary_range: string;
  work_mode: string;
  match_score: number;
  skill_coverage_score: number;
  experience_score: number;
  proficiency_score: number;
  matching_skills_count: number;
  total_required_skills: number;
  matched_skills: MatchSkillDetail[];
  missing_skills: MatchSkillDetail[];
  key_highlights: string[];
  is_top_match?: boolean;
}

export interface MatchExplanation {
  role_title: string;
  match_score: number;
  executive_summary: string;
  strengths_evidence: {
    skill_name: string;
    proficiency: string;
    confidence_pct: number;
    evidence_rationale: string;
    role_relevance: string;
  }[];
  critical_gaps: {
    skill_name: string;
    importance: string;
    required_level: string;
    gap_impact: string;
  }[];
  growth_potential_rationale: string;
  recommended_immediate_action: string;
}

export interface SkillGapItem {
  skill_name: string;
  importance: string;
  required_level: string;
  current_level: string;
  gap_severity: 'High' | 'Medium' | 'Low';
  rationale: string;
  recommended_resources: {
    id: number;
    title: string;
    provider: string;
    resource_type: string;
    difficulty: string;
    duration_hours: number;
    estimated_impact_pct: number;
  }[];
}

export interface SkillGapResponse {
  user_id: number;
  user_name: string;
  role_id: number;
  role_title: string;
  current_match_score: number;
  target_match_score: number;
  covered_skills: MatchSkillDetail[];
  gaps: SkillGapItem[];
}

export interface UnlockedRole {
  role_id: number;
  role_title: string;
  department: string;
  previous_score: number;
  projected_score: number;
  delta: number;
  status: string;
}

export interface WhatIfResponse {
  user_id: number;
  target_role_id: number;
  target_role_title: string;
  original_score: number;
  projected_score: number;
  score_delta: number;
  simulated_skills: string[];
  unlocked_roles: UnlockedRole[];
  recommended_pathway: string;
  disclaimer: string;
}

export interface RoadmapTask {
  title: string;
  description: string;
  type: 'learn' | 'build' | 'practice' | 'certify';
  duration: string;
  impact_pct: number;
  resource_title?: string;
}

export interface RoadmapMilestone {
  timeframe: string;
  phase_title: string;
  focus_skills: string[];
  tasks: RoadmapTask[];
  milestone_outcome: string;
}

export interface RoadmapResponse {
  user_id: number;
  user_name: string;
  target_role_id: number;
  target_role_title: string;
  current_compatibility: number;
  projected_compatibility: number;
  estimated_timeline: string;
  milestones: RoadmapMilestone[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  suggested_actions?: string[];
  data_references?: any;
}

export interface HRTalentOverview {
  total_profiles: number;
  verified_skills_count: number;
  inferred_skills_count: number;
  open_opportunities: number;
  internal_mobility_ready: number;
  critical_skills_risk_count: number;
}

export interface HiddenTalentItem {
  user_id: number;
  name: string;
  avatar: string;
  current_role: string;
  department: string;
  potential_role: string;
  potential_role_id: number;
  match_score: number;
  hidden_skills_evidence: string[];
  readiness: 'Ready Now' | 'Near Ready' | 'Upskill Potential';
}

export interface GraphNode {
  id: string;
  name: string;
  type: 'person' | 'project' | 'core_skill' | 'inferred_skill' | 'role';
  category: string;
  size: number;
  title?: string;
  department?: string;
  proficiency?: string;
  confidence_pct?: number;
  is_inferred?: boolean;
  evidence?: string[];
  description?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
