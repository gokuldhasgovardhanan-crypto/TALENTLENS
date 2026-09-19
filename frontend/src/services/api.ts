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
  // Auth
  async login(email: string, password?: string, demoRole?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: password || 'demo', demo_role: demoRole }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(name: string, email: string, userType: string, password?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, user_type: userType, password: password || 'demo' }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async getDemoUsers(): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/demo-users`);
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  async getCurrentUser(token?: string): Promise<User> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/auth/me`, { headers });
    if (!res.ok) throw new Error('Failed to fetch current user');
    return res.json();
  },

  // Resume Upload
  async uploadResume(userId: number, file: File) {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Resume upload failed');
    return res.json();
  },

  // Profiles
  async getProfile(userId: number): Promise<UserProfileDetail> {
    const res = await fetch(`${API_BASE}/profiles/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async getCandidates(): Promise<any[]> {
    try {
      const overview = await this.getHROverview();
      const res = await fetch(`${API_BASE}/hr/hidden-talent`);
      if (res.ok) {
        const talent = await res.json();
        return talent;
      }
      return [
        { id: 1, name: 'Arjun Kumar', title: 'Graduate Engineer', experience_years: 0.5, skills: ['Python', 'SQL', 'React'] },
        { id: 2, name: 'Priya Sharma', title: 'Senior Software Engineer', experience_years: 5.5, skills: ['Python', 'FastAPI', 'Docker', 'React'] },
        { id: 3, name: 'Rahul Menon', title: 'Senior Systems Engineer', experience_years: 6, skills: ['Python', 'Architecture', 'PostgreSQL'] },
      ];
    } catch {
      return [
        { id: 1, name: 'Arjun Kumar', title: 'Graduate Engineer', experience_years: 0.5, skills: ['Python', 'SQL', 'React'] },
        { id: 2, name: 'Priya Sharma', title: 'Senior Software Engineer', experience_years: 5.5, skills: ['Python', 'FastAPI', 'Docker', 'React'] },
        { id: 3, name: 'Rahul Menon', title: 'Senior Systems Engineer', experience_years: 6, skills: ['Python', 'Architecture', 'PostgreSQL'] },
      ];
    }
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
  async getRoles(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/roles`);
    if (!res.ok) {
      return [
        { id: 1, title: 'Senior AI Platform Engineer', department: 'Engineering', experience_level: 'senior', min_experience_years: 5, location: 'Remote', description: 'Build living skill graphs and LLM matching pipelines.', required_skills: ['Python', 'FastAPI', 'PyTorch'] },
        { id: 2, title: 'Junior Fullstack Developer', department: 'Product', experience_level: 'entry', min_experience_years: 0, location: 'Hybrid', description: 'Graduate role for web & frontend developers.', required_skills: ['React', 'TypeScript', 'Tailwind'] },
        { id: 3, title: 'Lead Systems Architect', department: 'Core Infra', experience_level: 'lead', min_experience_years: 8, location: 'San Francisco', description: 'Drive high-throughput microservices architecture.', required_skills: ['Go', 'Kubernetes', 'PostgreSQL'] }
      ];
    }
    return res.json();
  },

  async getRoleMatches(userId: number): Promise<RoleMatchResult[]> {
    const res = await fetch(`${API_BASE}/matching/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch role matches');
    return res.json();
  },

  async getMatches(userId: number): Promise<any[]> {
    return this.getRoleMatches(userId);
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

  async createJobRole(title: string, department: string, skills: { skill_name: string; importance: string }[]) {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        department,
        skills
      }),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  async createRole(roleData: any) {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: roleData.title,
        department: roleData.department,
        description: roleData.description,
        experience_level: roleData.experience_level || 'mid',
        min_experience_years: roleData.min_experience_years || 2,
        location: roleData.location || 'Remote',
        role_type: roleData.role_type || 'full-time',
        max_salary: roleData.max_salary,
        skills: (roleData.required_skills || []).map((s: string) => ({ skill_name: s, importance: 'required' }))
      }),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  async closeRole(roleId: string | number) {
    const res = await fetch(`${API_BASE}/roles/${roleId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to close role');
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

export const apiService = api;
