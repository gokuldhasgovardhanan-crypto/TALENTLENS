import React, { useState, useEffect } from 'react';
import { WhatIfResponse, UnlockedRole } from '../../types';
import { api } from '../../services/api';
import { useAppState } from '../../services/stateContext';
import { Zap, Plus, Check, ArrowRight, Sparkles, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillSimulatorProps {
  initialRoleId?: number;
  onViewRoadmap?: (roleId: number) => void;
}

export const SkillSimulator: React.FC<SkillSimulatorProps> = ({ initialRoleId = 1, onViewRoadmap }) => {
  const { currentUser, showToast } = useAppState();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Statistics']);
  const [targetRoleId, setTargetRoleId] = useState<number>(initialRoleId);
  const [simulationData, setSimulationData] = useState<WhatIfResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const availableSkillsToSimulate = [
    'Python',
    'Statistics',
    'Machine Learning',
    'ETL Pipelines',
    'Data Warehousing',
    'Cloud Computing',
    'Process Optimization',
    'TypeScript',
    'Docker'
  ];

  const runSim = async (skillsToSimulate: string[]) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await api.runSimulation(currentUser.id, targetRoleId, skillsToSimulate);
      setSimulationData(res);
      if (res.score_delta >= 10) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSim(selectedSkills);
  }, [currentUser, targetRoleId]);

  const toggleSkill = (skill: string) => {
    let updated: string[];
    if (selectedSkills.includes(skill)) {
      updated = selectedSkills.filter((s) => s !== skill);
    } else {
      updated = [...selectedSkills, skill];
    }
    setSelectedSkills(updated);
    runSim(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Setup */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                "What If I Learn This Skill?" — Career Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Dynamically re-execute the multi-factor matching engine to project score increases and unlock new career pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Target Role:</span>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-emerald-500"
            >
              <option value={1}>Data Analyst</option>
              <option value={2}>Business Analyst</option>
              <option value={3}>Junior ML Engineer</option>
              <option value={4}>Full Stack Engineer</option>
            </select>
          </div>
        </div>

        {/* Skill Adder Pills */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Select Skills to Simulate:
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSkillsToSimulate.map((s) => {
              const isSelected = selectedSkills.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Simulation Results Panel */}
      {simulationData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Score Delta Card */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between gap-6 relative overflow-hidden">
            
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Projected Match Score
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {simulationData.target_role_title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{simulationData.score_delta}% Increase</span>
                </div>
              </div>

              {/* Score Comparison Visual */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Current Baseline</div>
                  <div className="text-3xl font-black text-slate-300 mt-1">{simulationData.original_score}%</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center relative overflow-hidden">
                  <div className="text-xs text-emerald-400 font-bold">Projected Capability</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{simulationData.projected_score}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Match Trajectory</span>
                  <span className="font-bold text-emerald-400">{simulationData.projected_score}% Qualified</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${simulationData.projected_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Pathway Recommendation */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recommended Transition Strategy:</span>
                </div>
                <p className="leading-relaxed text-slate-300 pl-5">
                  {simulationData.recommended_pathway}
                </p>
              </div>
            </div>

            {/* Disclaimer & Action */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{simulationData.disclaimer}</span>
              </div>

              {onViewRoadmap && (
                <button
                  onClick={() => onViewRoadmap(targetRoleId)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Build This Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Unlocked Roles Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Newly Unlocked Opportunities</h3>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Acquiring {selectedSkills.join(' + ') || 'new skills'} unlocks additional organizational roles:
              </p>

              <div className="space-y-3 mt-4">
                {simulationData.unlocked_roles.map((r, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white">{r.role_title}</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {r.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>{r.previous_score}% $\to$ <strong className="text-emerald-400">{r.projected_score}%</strong></span>
                      <span className="text-emerald-400 font-semibold">+{r.delta}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              Re-calculated in real-time via local matching engine
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
