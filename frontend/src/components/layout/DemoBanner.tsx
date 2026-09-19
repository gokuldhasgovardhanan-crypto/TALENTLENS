import React from 'react';
import { useAppState } from '../../services/stateContext';
import { Play, ArrowRight, ArrowLeft, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { demoStep, setDemoStep, nextDemoStep, prevDemoStep, currentUser } = useAppState();

  if (demoStep === 0) return null;

  const steps = [
    {
      title: "1. Hidden Talent Discovery",
      desc: "Priya Sharma is titled 'Support Engineer', but TalentLens extracts & infers hidden capabilities: SQL, Power BI, and Data Analysis from incident tickets."
    },
    {
      title: "2. Living Skills Knowledge Graph",
      desc: "Explore visual connections between Priya, her incident projects, AI-inferred skills, and target job roles."
    },
    {
      title: "3. Transparent Role Matching",
      desc: "Matches Priya to 'Data Analyst' with 78% compatibility. Click 'Why this match?' to see verified evidence citations."
    },
    {
      title: "4. Precision Skill Gap Analysis",
      desc: "Identifies precise missing prerequisites: Python & Statistics with recommended targeted learning tracks."
    },
    {
      title: "5. Live What-If Career Simulator",
      desc: "Simulate learning Python + Statistics. The matching engine dynamically projects an 85%+ score and unlocks new opportunities!"
    },
    {
      title: "6. Milestone Career Roadmap",
      desc: "Generates a structured 0-3 mo, 3-6 mo, 6-12 mo transition timeline with hands-on projects and internal gig assignments."
    },
    {
      title: "7. AI Career Intelligence Assistant",
      desc: "Ask conversational career questions ('What roles fit me?', 'What to learn first?') answered deterministically from living data."
    },
    {
      title: "8. HR Workforce Talent Intelligence",
      desc: "Switched to Ananya HR: discover Priya as a 'Ready Now' internal Data Analyst candidate, view departmental skill heatmaps and risk alerts."
    }
  ];

  const currentStepInfo = steps[demoStep - 1] || steps[0];

  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-emerald-500/30 text-slate-100 shadow-xl py-2.5 px-4 sm:px-6 relative z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/30 shrink-0">
            {demoStep}/8
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                HACKATHON DEMO FLOW
              </span>
              <span className="text-xs font-semibold text-slate-200">
                — {currentStepInfo.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl line-clamp-1 sm:line-clamp-none">
              {currentStepInfo.desc}
            </p>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {demoStep > 1 && (
            <button
              onClick={prevDemoStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={nextDemoStep}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <span>{demoStep === 8 ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDemoStep(0)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors ml-1"
            title="Exit Demo Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
