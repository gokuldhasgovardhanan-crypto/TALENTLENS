import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { InteractiveSkillGraph } from '../../components/graph/InteractiveSkillGraph';
import { SkillSimulator } from '../../components/whatif/SkillSimulator';
import { ChatInterface } from '../../components/assistant/ChatInterface';
import { UserCheck, Sparkles, TrendingUp, Award, Users, ArrowUpRight, Compass } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mobility' | 'readiness' | 'graph' | 'simulator'>('mobility');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [candidatesData, rolesData] = await Promise.all([
          apiService.getCandidates(),
          apiService.getRoles(),
        ]);
        setCandidates(candidatesData);
        setRoles(rolesData);
      } catch (err) {
        console.error('Failed to load employee dashboard data:', err);
      } flex: {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const employeeProfile = candidates[0] || {
    name: 'Rahul Menon',
    title: 'Senior Product Software Engineer',
    department: 'Engineering',
    skills: ['Python', 'System Architecture', 'Microservices', 'PostgreSQL', 'Leadership'],
    experience_years: 6,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>Internal Talent Mobility & Advancement Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-purple-400">{employeeProfile.name}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Explore lateral movements, simulate promotion readiness for Principal/Lead roles, align internal project opportunities, and find cross-team mentors.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-400 transition-colors flex items-center space-x-2 shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Promotion Path</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'mobility', label: 'Internal Openings', icon: TrendingUp },
          { id: 'readiness', label: 'Promotion Readiness Score', icon: Award },
          { id: 'graph', label: 'Living Skill Graph', icon: Users },
          { id: 'simulator', label: 'What-If Career Simulator', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'mobility' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-white">Recommended Internal Opportunities</h2>
            <div className="space-y-4">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[11px] font-semibold">
                        {r.department}
                      </span>
                      <span className="text-xs text-slate-400">{r.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{r.title}</h3>
                    <p className="text-xs text-slate-400">{r.description}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Internal Fit</div>
                      <div className="text-lg font-black text-purple-400">91.5%</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500 hover:text-white font-semibold text-xs transition-colors flex items-center space-x-1"
                    >
                      <span>Check Gaps</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Internal Mentorship</h3>
              <p className="text-xs text-slate-400">
                Matched with Principal Engineer mentors to bridge leadership and system architecture gaps.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  AM
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Anita Roy</div>
                  <div className="text-xs text-slate-400">Principal Systems Architect</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'readiness' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Target Position: Principal Software Engineer</h2>
              <p className="text-xs text-slate-400">Overall Promotion Readiness Index</p>
            </div>
            <div className="text-3xl font-black text-purple-400">86.4%</div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Technical Depth (System Design, Cloud Arch)</span>
                <span className="text-emerald-400">95% (Ready)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Cross-Functional Leadership</span>
                <span className="text-amber-400">72% (In Progress)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'graph' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Living Skill Network</h2>
          <InteractiveSkillGraph />
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <SkillSimulator />
        </div>
      )}

      <ChatInterface />
    </div>
  );
};
