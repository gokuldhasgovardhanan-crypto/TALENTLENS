import React, { useState } from 'react';
import { useAppState } from '../services/stateContext';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { SkillCard } from '../components/profile/SkillCard';
import { EvidenceDrawer } from '../components/profile/EvidenceDrawer';
import { ProfileSkill } from '../types';
import { api } from '../services/api';
import { Sparkles, Layers, Briefcase, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profileDetail, refreshProfile, setActiveTab, showToast } = useAppState();
  const [selectedEvidenceSkill, setSelectedEvidenceSkill] = useState<ProfileSkill | null>(null);
  const [skillFilter, setSkillFilter] = useState<'all' | 'verified' | 'inferred'>('all');

  if (!profileDetail) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
        Loading Living Talent Profile...
      </div>
    );
  }

  const handleVerify = async (
    profileSkillId: number,
    action: 'confirm' | 'reject' | 'update_proficiency',
    proficiency?: string
  ) => {
    try {
      await api.verifySkill(profileSkillId, action, proficiency);
      await refreshProfile();
      showToast(
        action === 'confirm'
          ? '✓ AI-Inferred skill confirmed & verified in skills graph!'
          : 'Skill rejected and excluded from matching.'
      );
    } catch (err) {
      console.error('Skill verify failed:', err);
    }
  };

  const filteredSkills = profileDetail.skills.filter((s) => {
    if (skillFilter === 'verified') return !s.is_inferred || s.verification_status === 'confirmed';
    if (skillFilter === 'inferred') return s.is_inferred && s.verification_status !== 'confirmed';
    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* Living Profile Header */}
      <ProfileHeader
        profile={profileDetail}
        onExploreMatches={() => setActiveTab('matching')}
      />

      {/* Skills Matrix Section */}
      <div className="space-y-4">
        
        {/* Controls & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Living Skills Portfolio</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                {profileDetail.skills.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Verified capabilities backed by project evidence & AI inference
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setSkillFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                skillFilter === 'all'
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Skills ({profileDetail.skills.length})
            </button>
            <button
              onClick={() => setSkillFilter('verified')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                skillFilter === 'verified'
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified (
              {
                profileDetail.skills.filter(
                  (s) => !s.is_inferred || s.verification_status === 'confirmed'
                ).length
              }
              )
            </button>
            <button
              onClick={() => setSkillFilter('inferred')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                skillFilter === 'inferred'
                  ? 'bg-amber-500/15 text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Inferred (
              {
                profileDetail.skills.filter(
                  (s) => s.is_inferred && s.verification_status !== 'confirmed'
                ).length
              }
              )
            </button>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onVerify={handleVerify}
              onViewEvidence={(s) => setSelectedEvidenceSkill(s)}
            />
          ))}
        </div>

      </div>

      {/* Projects & Work Execution Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Demonstrated Projects & Work History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Execution artifacts that validate core capabilities and feed the skills graph
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileDetail.projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                  <div className="text-xs text-emerald-400 font-medium">{proj.role_performed}</div>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {proj.start_date} – {proj.end_date}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-400">Impact / Outcome:</span>
                <p className="text-emerald-300 mt-0.5">{proj.outcome}</p>
              </div>

              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Tech Stack: <strong className="text-slate-200">{proj.tech_stack}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Drawer Modal */}
      <EvidenceDrawer
        skill={selectedEvidenceSkill}
        onClose={() => setSelectedEvidenceSkill(null)}
      />

    </div>
  );
};
