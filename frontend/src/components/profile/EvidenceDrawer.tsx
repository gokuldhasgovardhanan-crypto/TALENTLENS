import React from 'react';
import { ProfileSkill } from '../../types';
import { X, CheckCircle, Calendar, Link as LinkIcon, ShieldAlert } from 'lucide-react';

interface EvidenceDrawerProps {
  skill: ProfileSkill | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">{skill.skill_name} Evidence Log</h2>
              {skill.is_inferred && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  AI Inferred
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">Verifiable provenance and execution artifacts</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Proficiency:</span> <span className="font-bold text-emerald-400">{skill.proficiency}</span>
            </div>
            <div>
              <span className="text-slate-400">Confidence:</span> <span className="font-bold text-emerald-400">{skill.confidence_pct}%</span>
            </div>
            <div>
              <span className="text-slate-400">Status:</span> <span className="font-bold text-slate-200 capitalize">{skill.verification_status}</span>
            </div>
          </div>

          {skill.evidence_items.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No specific project evidence logged yet for this skill.
            </div>
          ) : (
            skill.evidence_items.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                      {ev.source_type.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{ev.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {ev.recency_label}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-emerald-500/50">
                  "{ev.description}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Confidence: {ev.confidence_pct}%</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified System Record
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-850">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
