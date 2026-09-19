import React from 'react';
import { useAppState } from '../../services/stateContext';
import { ShieldCheck, CheckCircle2, UserCheck, Lock, AlertTriangle, X, Eye } from 'lucide-react';

export const ResponsibleAIModal: React.FC = () => {
  const { isResponsibleModalOpen, setIsResponsibleModalOpen } = useAppState();

  if (!isResponsibleModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Responsible AI & Transparency Manifesto</h2>
              <p className="text-xs text-slate-400">Ethical guardrails, verifiable provenance, and human agency</p>
            </div>
          </div>
          <button
            onClick={() => setIsResponsibleModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Principle 1 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white text-sm">1. Evidence First (Zero Black-Box Scoring)</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Every inferred skill, matching percentage, and recommendation is backed by traceable execution evidence (e.g. ticket telemetry, project commits, coursework). We never output scores without underlying citations.
              </p>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <UserCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white text-sm">2. Human in the Loop & Candidate Agency</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                AI recommends; humans decide. Candidates have complete autonomy to verify, edit proficiency, or reject AI-inferred skills. Rejected skills are immediately excluded from all matching engines.
              </p>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white text-sm">3. Protected Attributes Exclusion (Fairness by Design)</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Gender, age, ethnicity, caste, religion, geographic origin, and other sensitive demographic markers are strictly excluded from all matching, scoring, and ranking algorithms.
              </p>
            </div>
          </div>

          {/* Principle 4 */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white text-sm">4. Explicit AI Inference Labelling</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                We clearly label inferred capabilities with <span className="text-amber-400 font-mono text-[11px] bg-amber-400/10 px-1.5 py-0.5 rounded">AI-inferred — verify</span> tags and confidence scores, never presenting probabilistic inferences as unquestionable facts.
              </p>
            </div>
          </div>

          {/* Aggregate Fairness Telemetry */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-2">
              <span>Synthetic Disparate Impact Ratio</span>
              <span>1.02 (Parity Target: 0.95 - 1.05)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full w-[98%] rounded-full"></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              *Evaluated across synthetic talent cohorts for non-discriminatory matching variance.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-slate-850/50">
          <button
            onClick={() => setIsResponsibleModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close & Continue
          </button>
        </div>

      </div>
    </div>
  );
};
