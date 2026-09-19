import React, { useState, useEffect } from 'react';
import { HRTalentOverview, HiddenTalentItem } from '../../types';
import { api } from '../../services/api';
import { useAppState } from '../../services/stateContext';
import {
  Users,
  CheckCircle2,
  Sparkles,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Search,
  ArrowRight,
  ShieldAlert,
  Flame,
  UserCheck
} from 'lucide-react';

export const WorkforceOverview: React.FC = () => {
  const { setCurrentUser, demoUsers, setActiveTab, showToast } = useAppState();
  const [overview, setOverview] = useState<HRTalentOverview | null>(null);
  const [hiddenTalent, setHiddenTalent] = useState<HiddenTalentItem[]>([]);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('Data Analyst');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const [ov, ht, hm, rk] = await Promise.all([
          api.getHROverview(),
          api.getHiddenTalent(),
          api.getSkillsHeatmap(),
          api.getSkillRisks(),
        ]);
        setOverview(ov);
        setHiddenTalent(ht);
        setHeatmap(hm);
        setRisks(rk);
      } catch (err) {
        console.error('HR fetch error:', err);
      }
    };
    fetchHRData();
    handleSearch('Data Analyst');
  }, []);

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    try {
      const res = await api.searchInternalTalent(query);
      setSearchResults(res);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleViewCandidate = (userId: number) => {
    const user = demoUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setActiveTab('profile');
      showToast(`Switched view to ${user.name}'s living profile.`);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            Workforce Talent Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Organizational Skill Graph & Internal Mobility
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover the talent and capabilities you already have across engineering, operations, and support.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Real-time Talent Sync
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold">Total Profiles</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{overview.total_profiles}</div>
            <div className="text-[10px] text-emerald-400 mt-1">100% Indexed</div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold">Verified Skills</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white">{overview.verified_skills_count}</div>
            <div className="text-[10px] text-teal-400 mt-1">Evidence Backed</div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold">Inferred Skills</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{overview.inferred_skills_count}</div>
            <div className="text-[10px] text-amber-300 mt-1">AI Discovered</div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold">Open Roles</span>
              <Briefcase className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">{overview.open_opportunities}</div>
            <div className="text-[10px] text-slate-400 mt-1">Benchmark Roles</div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold">Mobility Ready</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400">{overview.internal_mobility_ready}</div>
            <div className="text-[10px] text-purple-300 mt-1">&ge;75% Compatibility</div>
          </div>

          <div className="glass-card rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-semibold">Skill Risks</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400">{overview.critical_skills_risk_count}</div>
            <div className="text-[10px] text-rose-300 mt-1">Low Concentration</div>
          </div>
        </div>
      )}

      {/* Hidden Talent Discovered Panel (Priya Sharma highlight) */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 glow-emerald">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Hidden Talent Discovered Beyond Official Job Titles
              </h2>
              <p className="text-xs text-slate-400">
                Employees demonstrating high-compatibility skills for alternate departments
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
            High-Leverage ROI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {hiddenTalent.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      <div className="text-[11px] text-slate-400">{item.current_role} ({item.department})</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-xs font-black">
                    {item.match_score}%
                  </span>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target Opportunity</div>
                  <div className="text-sm font-extrabold text-emerald-400">{item.potential_role}</div>
                  <div className="text-[11px] text-slate-300 mt-1 pl-2 border-l border-emerald-500/50">
                    Evidence: {item.hidden_skills_evidence[0] || 'SQL + Incident Telemetry'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleViewCandidate(item.user_id)}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Talent Search Engine */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white tracking-tight">Internal Talent Search & Readiness Ranking</h2>
          <p className="text-xs text-slate-400">Search by target role or skills to find ranked internal candidates across departments.</p>

          <div className="mt-4 flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search target role (e.g. Data Analyst, Business Analyst, ML)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              Search Talent
            </button>
          </div>
        </div>

        {/* 3-Tier Results: Ready Now, Near Ready, Upskill Potential */}
        {searchResults && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            {/* Ready Now */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Ready Now (&ge;85%)
                </span>
                <span className="text-xs font-black text-emerald-400">{searchResults.ready_now.length}</span>
              </div>

              {searchResults.ready_now.map((cand: any, i: number) => (
                <div key={i} className="glass-card rounded-xl p-3.5 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.current_role}</div>
                    </div>
                    <span className="text-base font-black text-emerald-400">{cand.match_score}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Matched: <span className="text-emerald-300 font-medium">{cand.matched_skills.join(', ')}</span>
                  </div>
                  <button
                    onClick={() => handleViewCandidate(cand.user_id)}
                    className="w-full py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-[11px] font-semibold transition-colors"
                  >
                    View Candidate
                  </button>
                </div>
              ))}
            </div>

            {/* Near Ready */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Near Ready (75-84%)
                </span>
                <span className="text-xs font-black text-cyan-400">{searchResults.near_ready.length}</span>
              </div>

              {searchResults.near_ready.map((cand: any, i: number) => (
                <div key={i} className="glass-card rounded-xl p-3.5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.current_role}</div>
                    </div>
                    <span className="text-base font-black text-cyan-400">{cand.match_score}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Gaps: <span className="text-amber-400 font-medium">{cand.missing_skills.join(', ')}</span>
                  </div>
                  <button
                    onClick={() => handleViewCandidate(cand.user_id)}
                    className="w-full py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    View Candidate
                  </button>
                </div>
              ))}
            </div>

            {/* Upskill Potential */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Upskill Potential (60-74%)
                </span>
                <span className="text-xs font-black text-amber-400">{searchResults.upskill_potential.length}</span>
              </div>

              {searchResults.upskill_potential.map((cand: any, i: number) => (
                <div key={i} className="glass-card rounded-xl p-3.5 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.current_role}</div>
                    </div>
                    <span className="text-base font-black text-amber-400">{cand.match_score}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Growth: <span className="text-slate-300">{cand.missing_skills.slice(0, 2).join(', ')}</span>
                  </div>
                  <button
                    onClick={() => handleViewCandidate(cand.user_id)}
                    className="w-full py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    View Candidate
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

      {/* Critical Skill Risk & Department Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Heatmap */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="font-bold text-base text-white tracking-tight mb-1">
            Department &times; Skill Capability Matrix
          </h3>
          <p className="text-xs text-slate-400 mb-4">Skill density across organizational teams</p>

          <div className="space-y-3">
            {heatmap.map((entry, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="font-bold text-xs text-white mb-2">{entry.department}</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                  {Object.entries(entry.skills).map(([sName, count]: [string, any]) => (
                    <div key={sName} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400 truncate">{sName}</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">{count} emp</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Skill Risks */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-white tracking-tight">Critical Skills with Limited Coverage</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Low skill concentration may create organizational dependency risk.
          </p>

          <div className="space-y-3">
            {risks.map((risk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-100">{risk.skill_name}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase">
                    {risk.risk_level} ({risk.employee_count} Employees)
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {risk.impact_description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
