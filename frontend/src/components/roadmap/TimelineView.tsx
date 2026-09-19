import React from 'react';
import { RoadmapResponse, RoadmapMilestone } from '../../types';
import { Map, Clock, CheckCircle, Code, BookOpen, Briefcase, Award, ArrowRight } from 'lucide-react';

interface TimelineViewProps {
  roadmap: RoadmapResponse | null;
  onSimulateAgain?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ roadmap, onSimulateAgain }) => {
  if (!roadmap) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
        Loading Personalized Career Roadmap...
      </div>
    );
  }

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'learn':
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case 'build':
        return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'practice':
        return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
      case 'certify':
        return <Award className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Roadmap Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                Personalized Roadmap
              </span>
              <span className="text-xs text-slate-400">• {roadmap.estimated_timeline} Trajectory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Path to {roadmap.target_role_title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Targeted capability milestones designed to advance your compatibility from <strong>{roadmap.current_compatibility}%</strong> to <strong>{roadmap.projected_compatibility}%+</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-center shrink-0">
            <div>
              <div className="text-xs text-slate-400 font-medium">Current</div>
              <div className="text-xl font-bold text-slate-300">{roadmap.current_compatibility}%</div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs text-emerald-400 font-bold">Projected</div>
              <div className="text-xl font-black text-emerald-400">{roadmap.projected_compatibility}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline Milestones */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-indigo-500 before:pointer-events-none">
        {roadmap.milestones.map((milestone, idx) => (
          <div key={idx} className="relative flex items-start gap-4 sm:gap-6 pl-2 sm:pl-4">
            
            {/* Timeline Node Badge */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-900 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 shrink-0 relative z-10">
              0{idx + 1}
            </div>

            {/* Milestone Content Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex-1 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Phase {idx + 1} • {milestone.timeframe}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{milestone.phase_title}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {milestone.focus_skills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {milestone.tasks.map((task, tIdx) => (
                  <div
                    key={tIdx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5 sm:mt-0">
                        {getTaskIcon(task.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-100">{task.title}</h4>
                          <span className="px-2 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 uppercase font-semibold">
                            {task.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                        {task.resource_title && (
                          <div className="text-[11px] text-emerald-400/90 font-medium mt-1">
                            Resource: {task.resource_title}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{task.duration}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                        +{task.impact_pct}% Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phase Outcome */}
              <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                <span className="font-semibold text-slate-300">Target Outcome:</span>
                <span className="text-slate-400">{milestone.milestone_outcome}</span>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
