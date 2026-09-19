import React from 'react';
import { UserProfileDetail } from '../../types';
import { MapPin, Briefcase, Award, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfileDetail;
  onExploreMatches: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onExploreMatches }) => {
  const verifiedCount = profile.skills.filter((s) => s.verification_status === 'verified' || s.verification_status === 'confirmed').length;
  const inferredCount = profile.skills.filter((s) => s.is_inferred).length;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Avatar & Personal Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={profile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/10"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
              {profile.career_stage}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {profile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-emerald-400">
                {profile.current_title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>{profile.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span>{profile.experience_years} Years Experience</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Right: Capability Metrics & Action */}
        <div className="flex flex-col sm:flex-row items-stretch lg:items-end gap-4 w-full lg:w-auto shrink-0">
          
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <div className="px-3">
              <div className="text-xl font-black text-emerald-400">{verifiedCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Verified Skills</div>
            </div>
            <div className="px-3 border-l border-slate-800">
              <div className="text-xl font-black text-amber-400">{inferredCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">AI Inferred</div>
            </div>
          </div>

          <button
            onClick={onExploreMatches}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find Opportunities</span>
          </button>

        </div>

      </div>
    </div>
  );
};
