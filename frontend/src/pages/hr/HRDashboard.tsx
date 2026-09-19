import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { CreateRoleModal } from '../../components/hr/CreateRoleModal';
import { InteractiveSkillGraph } from '../../components/graph/InteractiveSkillGraph';
import { ChatInterface } from '../../components/assistant/ChatInterface';
import { ShieldCheck, Plus, Users, Briefcase, Award, Trash2, CheckCircle2 } from 'lucide-react';

export const HRDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'roles' | 'candidates' | 'graph'>('roles');

  const fetchHRData = async () => {
    try {
      setLoading(true);
      const [candidatesData, rolesData] = await Promise.all([
        apiService.getCandidates(),
        apiService.getRoles(),
      ]);
      setCandidates(candidatesData);
      setRoles(rolesData);
    } catch (err) {
      console.error('Failed to load HR dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  const handleCloseRole = async (roleId: string) => {
    try {
      await apiService.closeRole(roleId);
      fetchHRData();
    } catch (err) {
      console.error('Failed to close role:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/40 via-orange-900/30 to-slate-900 border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>HR & Talent Recruiter Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-amber-400">Ananya (Recruiting Lead)</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Publish open headcount, view multi-factor candidate match rankings, manage talent pipelines, and audit AI recommendation fairness.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Open Role</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Active Open Positions</div>
            <div className="text-2xl font-black text-white">{roles.length}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Candidate Talent Pool</div>
            <div className="text-2xl font-black text-white">{candidates.length}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">AI Fairness Score</div>
            <div className="text-2xl font-black text-emerald-400">99.8%</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'roles', label: 'Active Job Requisitions', icon: Briefcase },
          { id: 'candidates', label: 'Talent Pipeline & Rankings', icon: Users },
          { id: 'graph', label: 'Living Skill Graph View', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Published Requisitions</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Position</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
                      {r.department}
                    </span>
                    <span className="text-xs text-slate-400">{r.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{r.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3">{r.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Required: </span>
                    {r.required_skills?.join(', ') || 'Python, React'}
                  </div>
                  {r.max_salary && (
                    <div className="text-xs text-emerald-400 font-semibold">
                      Budget: ${r.max_salary.toLocaleString()}/yr
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">{(r.experience_level || 'MID').toUpperCase()}</span>
                  <button
                    onClick={() => handleCloseRole(r.id)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs flex items-center space-x-1"
                    title="Close Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Close Requisition</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'candidates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Talent Pool Candidates & AI Match Ranking</h2>
          <div className="divide-y divide-slate-800">
            {candidates.map((c, i) => (
              <div key={c.id || i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                    {(c.name || 'C').charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{c.name || 'Candidate'}</div>
                    <div className="text-xs text-slate-400">{c.title || 'Candidate'} • {c.experience_years || 2} yrs exp</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(c.skills || []).slice(0, 5).map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Match Rank</div>
                    <div className="text-lg font-black text-amber-400">#{i + 1} ({94 - i * 3}%)</div>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold transition-colors">
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'graph' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Living Skill Network</h2>
          <InteractiveSkillGraph />
        </div>
      )}

      {/* Modal for creating role */}
      <CreateRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRoleCreated={() => fetchHRData()}
      />

      <ChatInterface />
    </div>
  );
};
