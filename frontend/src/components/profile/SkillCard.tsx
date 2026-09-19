import React, { useState } from 'react';
import { ProfileSkill } from '../../types';
import { CheckCircle2, XCircle, FileText, Sparkles, ChevronRight, Check } from 'lucide-react';

interface SkillCardProps {
  skill: ProfileSkill;
  onVerify: (id: number, action: 'confirm' | 'reject' | 'update_proficiency', prof?: string) => void;
  onViewEvidence: (skill: ProfileSkill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onVerify, onViewEvidence }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProf, setSelectedProf] = useState(skill.proficiency);

  const isConfirmed = skill.verification_status === 'confirmed';
  const isInferred = skill.is_inferred && skill.verification_status !== 'confirmed';

  const proficiencyColors = {
    Beginner: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Intermediate: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Expert: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div
      className={`glass-card rounded-xl p-4 border flex flex-col justify-between gap-3 relative ${
        isInferred ? 'border-amber-500/30 bg-amber-500/5' : 'border-slate-800'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {skill.category}
          </span>

          {isInferred ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-400 animate-subtle-pulse">
              <Sparkles className="w-2.5 h-2.5" />
              AI-Inferred — verify
            </span>
          ) : isConfirmed ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
              <Check className="w-2.5 h-2.5" />
              Verified & Confirmed
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-medium text-slate-300">
              Verified
            </span>
          )}
        </div>

        {/* Skill Title & Proficiency */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-white tracking-tight">{skill.skill_name}</h3>
            <p className="text-xs text-slate-400">{skill.cluster}</p>
          </div>

          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
              proficiencyColors[skill.proficiency] || proficiencyColors.Intermediate
            }`}
          >
            {skill.proficiency}
          </span>
        </div>

        {/* Confidence Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Confidence</span>
            <span className="font-semibold text-slate-200">{skill.confidence_pct}%</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isInferred
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${skill.confidence_pct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        {/* View Evidence Button */}
        <button
          onClick={() => onViewEvidence(skill)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{skill.evidence_items.length} Evidence</span>
        </button>

        {/* Inferred Verification Buttons */}
        {isInferred && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onVerify(skill.id, 'confirm')}
              className="p-1 px-2 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Confirm this inferred skill"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Confirm</span>
            </button>
            <button
              onClick={() => onVerify(skill.id, 'reject')}
              className="p-1 px-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold transition-colors"
              title="Reject skill"
            >
              <XCircle className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
