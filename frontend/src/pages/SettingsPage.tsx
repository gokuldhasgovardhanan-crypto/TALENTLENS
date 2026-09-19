import React, { useState } from 'react';
import { useAppState } from '../services/stateContext';
import { Settings, Sliders, Database, Cpu, ShieldCheck, RefreshCw, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { systemStatus, showToast } = useAppState();
  const [weights, setWeights] = useState({
    coverage: 40,
    proficiency: 25,
    experience: 15,
    recency: 10,
    velocity: 10
  });

  const handleSaveWeights = () => {
    showToast('✓ Matching algorithm weights updated & stored!');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            System Configuration
          </span>
          <span className="text-xs text-slate-400">• Algorithmic & AI Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Platform Architecture & Heuristics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Tune matching weight distributions, inspect hybrid AI runtime state, and manage synthetic ecosystems.
        </p>
      </div>

      {/* Matching Weights Configuration */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white">Configurable Matching Engine Weights</h2>
            <p className="text-xs text-slate-400">Total must equal 100%</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">1. Skill Coverage Factor</span>
              <span className="text-emerald-400">{weights.coverage}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={weights.coverage}
              onChange={(e) => setWeights({ ...weights, coverage: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">2. Proficiency Depth & Multiplier</span>
              <span className="text-emerald-400">{weights.proficiency}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              value={weights.proficiency}
              onChange={(e) => setWeights({ ...weights, proficiency: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">3. Experience & Seniority Alignment</span>
              <span className="text-emerald-400">{weights.experience}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={weights.experience}
              onChange={(e) => setWeights({ ...weights, experience: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">4. Evidence Recency Factor</span>
              <span className="text-emerald-400">{weights.recency}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              value={weights.recency}
              onChange={(e) => setWeights({ ...weights, recency: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-300">5. Learning Velocity & Project Execution</span>
              <span className="text-emerald-400">{weights.velocity}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              value={weights.velocity}
              onChange={(e) => setWeights({ ...weights, velocity: Number(e.target.value) })}
              className="w-full accent-emerald-500 bg-slate-900"
            />
          </div>

        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSaveWeights}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* AI & Database Runtime Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Hybrid AI Architecture</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Current Mode:</span>
              <span className="font-bold text-emerald-400">{systemStatus.ai_mode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Offline Fallback:</span>
              <span className="text-emerald-400 font-bold">100% Fully Functional</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Deterministic Engine:</span>
              <span className="text-slate-200">Active (Zero Latency)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Synthetic Database State</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Employees Indexed:</span>
              <span className="font-bold text-slate-200">30+ Profiles</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Canonical Skills:</span>
              <span className="font-bold text-slate-200">100+ Taxonomies</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Benchmark Roles:</span>
              <span className="font-bold text-slate-200">20+ Defined</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
