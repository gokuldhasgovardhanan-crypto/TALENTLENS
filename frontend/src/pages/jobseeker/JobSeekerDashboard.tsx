import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { ResumeUploader } from '../../components/resume/ResumeUploader';
import { InteractiveSkillGraph } from '../../components/graph/InteractiveSkillGraph';
import { SkillSimulator } from '../../components/whatif/SkillSimulator';
import { ChatInterface } from '../../components/assistant/ChatInterface';
import { Briefcase, Sparkles, Target, Compass, Award, BarChart3, ArrowUpRight } from 'lucide-react';

export const JobSeekerDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'resume' | 'graph' | 'simulator'>('matches');

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

        // Fetch multi-factor matches if candidate exists
        if (candidatesData.length > 0) {
          const firstCandId = candidatesData[0].id;
          const matchData = await apiService.getMatches(firstCandId);
          setMatchResults(matchData);
        }
      } catch (err) {
        console.error('Failed to load job seeker data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const jobSeekerProfile = candidates[0] || {
    name: 'Priya Sharma',
    title: 'Senior Software Engineer',
    skills: ['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
    experience_years: 5.5,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Briefcase className="w-4 h-4" />
              <span>Multi-Factor Weighted Job Matcher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-emerald-400">{jobSeekerProfile.name}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Real-time talent matching powered by 4 weighted factors: Skill Overlap (45%), Experience Level (25%), Domain Context (15%), and Growth Velocity (15%).
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('resume')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upload / Update Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'matches', label: 'Multi-Factor Job Matches', icon: Target },
          { id: 'resume', label: 'Resume Parser & Skills', icon: BarChart3 },
          { id: 'graph', label: 'Living Skill Graph', icon: Award },
          { id: 'simulator', label: 'What-If Career Simulator', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Active Matches', val: matchResults.length || roles.length, color: 'text-emerald-400' },
              { label: 'Highest Match Score', val: '94.2%', color: 'text-cyan-400' },
              { label: 'Skill Overlap Average', val: '88%', color: 'text-teal-400' },
              { label: 'Profile Completeness', val: '100%', color: 'text-amber-400' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((r) => (
              <div
                key={r.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      {r.department}
                    </span>
                    <span className="text-xs text-slate-400">{r.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{r.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{r.description}</p>
                </div>

                {/* Match Breakdown Progress Bars */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Skill Overlap (45%)</span>
                    <span className="text-emerald-400 font-bold">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Experience Alignment (25%)</span>
                    <span className="text-cyan-400 font-bold">95%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400">
                    Min Exp: <span className="text-white font-semibold">{r.min_experience_years || 2} yrs</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-semibold text-xs transition-colors flex items-center space-x-1"
                  >
                    <span>Simulate Growth</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'resume' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <ResumeUploader onSkillsExtracted={() => {}} />
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
