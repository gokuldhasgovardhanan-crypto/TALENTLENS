import React, { useState, useEffect } from 'react';
import { RoleMatchResult, MatchExplanation } from '../types';
import { api } from '../services/api';
import { useAppState } from '../services/stateContext';
import { RoleCard } from '../components/matching/RoleCard';
import { WhyMatchModal } from '../components/matching/WhyMatchModal';
import { Sparkles, Search, Filter, Briefcase, RefreshCw } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { currentUser, setActiveTab, setActiveTargetRoleId } = useAppState();
  const [matches, setMatches] = useState<RoleMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [explanation, setExplanation] = useState<MatchExplanation | null>(null);

  const fetchMatches = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getRoleMatches(currentUser.id);
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch role matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [currentUser]);

  const handleWhyMatch = async (roleId: number) => {
    if (!currentUser) return;
    try {
      const exp = await api.explainMatch(currentUser.id, roleId);
      setExplanation(exp);
      setActiveTargetRoleId(roleId);
    } catch (err) {
      console.error('Explain error:', err);
    }
  };

  const handleViewRoadmap = (roleId: number) => {
    setActiveTargetRoleId(roleId);
    setActiveTab('roadmap');
  };

  const handleSimulate = (roleId: number) => {
    setActiveTargetRoleId(roleId);
    setActiveTab('whatif');
  };

  const departments = ['All', 'Data & Analytics', 'Operations & Strategy', 'Engineering', 'Operations'];

  const filteredMatches = matches.filter((m) => {
    const matchesDept = selectedDept === 'All' || m.department.includes(selectedDept);
    const matchesWork = selectedWorkMode === 'All' || m.work_mode === selectedWorkMode;
    const matchesSearch =
      m.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesWork && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              Explainable Role Matching
            </span>
            <span className="text-xs text-slate-400">• Multi-factor Compatibility</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Discover Your Matched Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent algorithmic scoring based on verified capabilities, proficiency depth, and project execution.
          </p>
        </div>

        <button
          onClick={fetchMatches}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter roles or departments..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Mode:</span>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

      </div>

      {/* Role Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((role) => (
          <RoleCard
            key={role.role_id}
            role={role}
            onWhyMatch={handleWhyMatch}
            onViewRoadmap={handleViewRoadmap}
            onSimulate={handleSimulate}
          />
        ))}
      </div>

      {/* Why Match Explanation Modal */}
      <WhyMatchModal
        explanation={explanation}
        onClose={() => setExplanation(null)}
        onSimulate={() => {
          setActiveTab('whatif');
        }}
        onViewRoadmap={() => {
          setActiveTab('roadmap');
        }}
      />

    </div>
  );
};
