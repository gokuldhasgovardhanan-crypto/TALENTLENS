import React from 'react';
import { MatchExplanation } from '../../types';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface WhyMatchModalProps {
  explanation: MatchExplanation | null;
  onClose: () => void;
  onSimulate: () => void;
  onViewRoadmap: () => void;
}

export const WhyMatchModal: React.FC<WhyMatchModalProps> = ({
  explanation,
  onClose,
  onSimulate,
  onViewRoadmap,
}) => {
  if (!explanation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Why TalentLens Recommends {explanation.role_title}
              </h2>
              <p className="text-xs text-slate-400">
                Transparent evidence-based breakdown • {explanation.match_score}% Match Compatibility
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 leading-relaxed font-medium">
            "{explanation.executive_summary}"
          </div>

          {/* Strengths & Evidence */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Alignment & Underlying Evidence</span>
            </h3>

            <div className="space-y-2.5">
              {explanation.strengths_evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{item.skill_name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-emerald-400">
                        {item.proficiency}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">{item.confidence_pct}% Confidence</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed pl-2.5 border-l-2 border-emerald-500">
                    "{item.evidence_rationale}"
                  </p>

                  <div className="text-[11px] text-slate-400 pt-0.5">
                    Impact: <span className="text-slate-200">{item.role_relevance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Gaps & Leverage */}
          {explanation.critical_gaps.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Targeted Prerequisite Growth Opportunities</span>
              </h3>

              <div className="space-y-2">
                {explanation.critical_gaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{gap.skill_name}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{gap.gap_impact}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase shrink-0">
                      Req: {gap.required_level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Potential & Action */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200">Immediate Recommended Action:</div>
            <p className="text-slate-300 leading-relaxed">
              {explanation.recommended_immediate_action}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verifiable Transparent Scoring</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSimulate();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              Simulate Growth
            </button>
            <button
              onClick={() => {
                onClose();
                onViewRoadmap();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-1"
            >
              <span>See Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
