import React, { useState } from 'react';
import { RoleMatchResult } from '../../types';
import { Sparkles, Check, AlertCircle, ThumbsUp, ThumbsDown, HelpCircle, ArrowRight, Zap, Map } from 'lucide-react';
import { api } from '../../services/api';
import { useAppState } from '../../services/stateContext';

interface RoleCardProps {
  role: RoleMatchResult;
  onWhyMatch: (roleId: number) => void;
  onViewRoadmap: (roleId: number) => void;
  onSimulate: (roleId: number) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onWhyMatch, onViewRoadmap, onSimulate }) => {
  const { currentUser, showToast } = useAppState();
  const [feedbackSent, setFeedbackSent] = useState<boolean | null>(null);
  const [showFeedbackPicker, setShowFeedbackPicker] = useState(false);

  const handleFeedback = async (isPositive: boolean, reason: string = '') => {
    if (!currentUser) return;
    setFeedbackSent(isPositive);
    setShowFeedbackPicker(false);
    showToast(isPositive ? '👍 Feedback noted! Tuning future recommendations.' : '👎 Feedback recorded. We appreciate the signal!');
    try {
      await api.sendFeedback(
        currentUser.id,
        'role',
        role.role_id,
        role.role_title,
        isPositive,
        reason
      );
    } catch (err) {
      console.error('Feedback submission failed:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between gap-5 relative group">
      <div>
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight">{role.role_title}</h3>
              {role.is_top_match && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Top Match
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {role.department} • {role.level} • {role.work_mode}
            </p>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1.5 rounded-xl border text-base font-black tracking-tight ${getScoreColor(role.match_score)}`}>
              {role.match_score}%
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Match Compatibility</span>
          </div>
        </div>

        {/* Salary & Metrics */}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-300 font-medium bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
          <span>{role.salary_range}</span>
          <span className="text-slate-600">•</span>
          <span>{role.matching_skills_count} of {role.total_required_skills} Skills Covered</span>
        </div>

        {/* Strong Alignment Skills */}
        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strong Demonstrated Alignment</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {role.matched_skills.slice(0, 4).map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1"
              >
                ✓ {s.skill_name}
              </span>
            ))}
          </div>
        </div>

        {/* Skill Gaps */}
        {role.missing_skills.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Prerequisite Growth Areas</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.missing_skills.slice(0, 3).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1"
                >
                  △ {s.skill_name}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Action Buttons & Feedback Footer */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onWhyMatch(role.role_id)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Why?</span>
          </button>

          <button
            onClick={() => onSimulate(role.role_id)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate</span>
          </button>

          <button
            onClick={() => onViewRoadmap(role.role_id)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </button>
        </div>

        {/* Feedback Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Was this match helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback(true, 'Good skill match')}
              className={`p-1 rounded hover:text-emerald-400 transition-colors ${
                feedbackSent === true ? 'text-emerald-400 font-bold' : ''
              }`}
              title="Helpful recommendation"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowFeedbackPicker(true)}
              className={`p-1 rounded hover:text-rose-400 transition-colors ${
                feedbackSent === false ? 'text-rose-400 font-bold' : ''
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Feedback Reason Picker */}
        {showFeedbackPicker && (
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 animate-in fade-in">
            <div className="text-[10px] text-slate-400 font-semibold">Help us understand why:</div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {['Wrong skill', 'Wrong role', 'Experience mismatch', 'Not interested'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleFeedback(false, reason)}
                  className="p-1 px-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-left truncate"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
