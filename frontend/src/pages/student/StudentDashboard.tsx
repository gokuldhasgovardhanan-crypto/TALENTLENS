import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { ResumeUploader } from '../../components/resume/ResumeUploader';
import { InteractiveSkillGraph } from '../../components/graph/InteractiveSkillGraph';
import { SkillSimulator } from '../../components/whatif/SkillSimulator';
import { ChatInterface } from '../../components/assistant/ChatInterface';
import { GraduationCap, Sparkles, BookOpen, Target, ArrowRight, Award, Compass } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'internships' | 'simulator'>('overview');

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
        console.error('Failed to load student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const studentProfile = candidates[0] || {
    name: 'Arjun Kumar',
    title: 'Computer Science Graduate',
    skills: ['Python', 'SQL', 'Data Structures', 'React', 'HTML/CSS'],
    experience_years: 0.5,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-slate-900 border border-cyan-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>Student & Graduate Talent Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-cyan-400">{studentProfile.name}</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Discover entry-level roles, quantify your skill readiness, upload academic projects, and build a targeted roadmap to land your first tech job.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Skill Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'overview', label: 'Overview & Profile', icon: BookOpen },
          { id: 'skills', label: 'Living Skill Graph', icon: Award },
          { id: 'internships', label: 'Entry & Graduate Roles', icon: Target },
          { id: 'simulator', label: 'What-If Career Simulator', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Views */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Resume / Academic Project Uploader */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <ResumeUploader onSkillsExtracted={() => {}} />
            </div>

            {/* Academic Projects & Extracted Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Current Verified Skill Graph</h3>
              <div className="flex flex-wrap gap-2">
                {(studentProfile.skills || []).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                <span>Top Entry Matches</span>
                <span className="text-xs text-cyan-400 font-normal">Fresh Graduate</span>
              </h3>
              <div className="space-y-3">
                {roles.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="font-semibold text-white text-sm">{r.title}</div>
                    <div className="text-xs text-slate-400 flex items-center justify-between mt-1">
                      <span>{r.department}</span>
                      <span className="text-emerald-400 font-semibold">88% Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Living Skills Graph</h2>
          <InteractiveSkillGraph />
        </div>
      )}

      {activeTab === 'internships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-semibold">
                    {(r.experience_level || 'ENTRY').toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">{r.location}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{r.title}</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">{r.department}</p>
                <p className="text-xs text-slate-300 line-clamp-3 mb-4">{r.description}</p>
              </div>

              <button
                onClick={() => setActiveTab('simulator')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
              >
                <span>Check Match & Skill Gap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <SkillSimulator />
        </div>
      )}

      {/* Floating AI Assistant */}
      <ChatInterface />
    </div>
  );
};
