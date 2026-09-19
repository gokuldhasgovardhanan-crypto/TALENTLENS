import {
  User,
  UserProfileDetail,
  RoleMatchResult,
  MatchExplanation,
  SkillGapResponse,
  WhatIfResponse,
  RoadmapResponse,
  AssistantMessage,
  HRTalentOverview,
  HiddenTalentItem,
  GraphData
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth & Demo Users
  async getDemoUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  async demoLogin(userId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  },

  // Profiles
  async getProfile(userId: number): Promise<UserProfileDetail> {
    const res = await fetch(`${API_BASE}/profiles/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  // Skills
  async verifySkill(profileSkillId: number, action: 'confirm' | 'reject' | 'update_proficiency', proficiency?: string) {
    const res = await fetch(`${API_BASE}/skills/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_skill_id: profileSkillId,
        action,
        proficiency
      }),
    });
    if (!res.ok) throw new Error('Failed to verify skill');
    return res.json();
  },

  async getSkillGraph(userId: number): Promise<GraphData> {
    const res = await fetch(`${API_BASE}/skills/graph/${userId}`);
    if (!res.ok) throw new Error('Failed to load skill graph');
    return res.json();
  },

  // Roles & Matching
  async getRoleMatches(userId: number): Promise<RoleMatchResult[]> {
    const res = await fetch(`${API_BASE}/matching/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch role matches');
    return res.json();
  },

  async explainMatch(userId: number, roleId: number): Promise<MatchExplanation> {
    const res = await fetch(`${API_BASE}/matching/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, role_id: roleId }),
    });
    if (!res.ok) throw new Error('Failed to fetch match explanation');
    return res.json();
  },

  async getSkillGaps(userId: number, roleId: number): Promise<SkillGapResponse> {
    const res = await fetch(`${API_BASE}/matching/gaps/${userId}/${roleId}`);
    if (!res.ok) throw new Error('Failed to fetch skill gaps');
    return res.json();
  },

  // What-If Simulation
  async runSimulation(userId: number, targetRoleId: number, simulatedSkills: string[]): Promise<WhatIfResponse> {
    const res = await fetch(`${API_BASE}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        target_role_id: targetRoleId,
        simulated_skills: simulatedSkills,
        simulated_proficiency: 'Intermediate'
      }),
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return res.json();
  },

  // Career Roadmap
  async getRoadmap(userId: number, roleId?: number): Promise<RoadmapResponse> {
    const url = roleId ? `${API_BASE}/roadmap/${userId}?role_id=${roleId}` : `${API_BASE}/roadmap/${userId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  // AI Assistant
  async askAssistant(userId: number, message: string, history: AssistantMessage[]) {
    const res = await fetch(`${API_BASE}/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        message,
        conversation_history: history
      }),
    });
    if (!res.ok) throw new Error('Assistant communication failed');
    return res.json();
  },

  // HR Analytics
  async getHROverview(): Promise<HRTalentOverview> {
    const res = await fetch(`${API_BASE}/hr/overview`);
    if (!res.ok) throw new Error('Failed to fetch HR overview');
    return res.json();
  },

  async getHiddenTalent(): Promise<HiddenTalentItem[]> {
    const res = await fetch(`${API_BASE}/hr/hidden-talent`);
    if (!res.ok) throw new Error('Failed to fetch hidden talent');
    return res.json();
  },

  async getSkillsHeatmap(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hr/skills-heatmap`);
    if (!res.ok) throw new Error('Failed to fetch skill heatmap');
    return res.json();
  },

  async getSkillRisks(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hr/skill-risks`);
    if (!res.ok) throw new Error('Failed to fetch skill risks');
    return res.json();
  },

  async searchInternalTalent(query: string, department?: string): Promise<any> {
    const params = new URLSearchParams({ query });
    if (department) params.append('department', department);
    const res = await fetch(`${API_BASE}/hr/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to perform talent search');
    return res.json();
  },

  // Feedback Loop
  async sendFeedback(userId: number, recommendationType: string, itemId: number, itemTitle: string, isPositive: boolean, reason: string, comment?: string) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        recommendation_type: recommendationType,
        item_id: itemId,
        item_title: itemTitle,
        is_positive: isPositive,
        feedback_reason: reason,
        comment: comment || ''
      }),
    });
    return res.json();
  },

  // System Status
  async getStatus(): Promise<{ status: string; ai_mode: string; offline_ready: boolean }> {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) return { status: 'healthy', ai_mode: 'Local Mode', offline_ready: true };
    return res.json();
  }
};
