import React, { useState, useEffect } from 'react';
import { SkillGapResponse } from '../types';
import { api } from '../services/api';
import { useAppState } from '../services/stateContext';
import { Layers, CheckCircle2, AlertCircle, BookOpen, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const SkillGapsPage: React.FC = () => {
  const { currentUser, activeTargetRoleId, setActiveTab } = useAppState();
  const [gapData, setGapData] = useState<SkillGapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(activeTargetRoleId || 1);

  const fetchGaps = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getSkillGaps(currentUser.id, selectedRoleId);
      setGapData(data);
    } catch (err) {
      console.error('Failed to fetch skill gaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, [currentUser, selectedRoleId]);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              Skill Gap Intelligence
            </span>
            <span className="text-xs text-slate-400">• Role Readiness Diagnosis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Current Capabilities vs Target Role Requirements
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify exact missing prerequisites and high-impact learning pathways to achieve 90%+ qualification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Target Role:</span>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-emerald-500"
          >
            <option value={1}>Data Analyst</option>
            <option value={2}>Business Analyst</option>
            <option value={3}>Junior ML Engineer</option>
            <option value={4}>Full Stack Engineer</option>
          </select>
        </div>
      </div>

      {gapData && (
        <div className="space-y-6">
          
          {/* Summary Metric Banner */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Target Opportunity
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">{gapData.role_title}</h2>
              <p className="text-xs text-slate-300 mt-1">
                You currently satisfy <strong>{gapData.covered_skills.length}</strong> core skills. Closing the remaining <strong>{gapData.gaps.length}</strong> gaps will elevate match from {gapData.current_match_score}% to {gapData.target_match_score}%.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('whatif')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Simulate Closing Gaps</span>
            </button>
          </div>

          {/* 2-Column Comparison Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Column 1: Covered Skills */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">Covered Core Skills ({gapData.covered_skills.length})</h3>
                </div>
                <span className="text-xs font-bold text-emerald-400">Demonstrated</span>
              </div>

              <div className="space-y-3">
                {gapData.covered_skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-100">{skill.skill_name}</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        {skill.candidate_proficiency}
                      </span>
                    </div>

                    {skill.evidence_summary && (
                      <p className="text-xs text-slate-400 pl-2 border-l border-emerald-500/50 leading-relaxed">
                        Evidence: {skill.evidence_summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Missing Skill Gaps */}
            <div className="glass-panel rounded-2xl p-6 border border-amber-500/30 glow-amber space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">Missing Skill Gaps ({gapData.gaps.length})</h3>
                </div>
                <span className="text-xs font-bold text-amber-400">Growth Targets</span>
              </div>

              <div className="space-y-4">
                {gapData.gaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-white">{gap.skill_name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{gap.rationale}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase shrink-0">
                        {gap.gap_severity} Severity
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                      <div>
                        Current: <strong className="text-slate-200">{gap.current_level}</strong>
                      </div>
                      <span className="text-slate-600">•</span>
                      <div>
                        Required: <strong className="text-amber-400">{gap.required_level}</strong>
                      </div>
                    </div>

                    {/* Recommended Resources */}
                    {gap.recommended_resources.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Recommended Learning Track:</span>
                        </div>
                        {gap.recommended_resources.slice(0, 1).map((res) => (
                          <div
                            key={res.id}
                            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-slate-200">{res.title}</div>
                              <div className="text-[10px] text-slate-400">{res.provider} • {res.duration_hours} hrs</div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                              +{res.estimated_impact_pct}% Impact
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
