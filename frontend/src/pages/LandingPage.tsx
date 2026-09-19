import React from 'react';
import { useAppState } from '../services/stateContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Map,
  Layers,
  GitBranch,
  Bot,
  Users,
  CheckCircle2,
  Play,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Building
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, startGuidedDemo, demoUsers, setCurrentUser } = useAppState();

  const handleSelectPersona = (userName: string, targetTab: string = 'profile') => {
    const user = demoUsers.find((u) => u.name.includes(userName));
    if (user) {
      setCurrentUser(user);
      setActiveTab(targetTab);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Talent Discovery & Career Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Discover the Talent Your Resume <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Can't Show.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TalentLens uses AI-powered skill intelligence to understand what people can do, what they could become, and which opportunities fit their true potential.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Build My Talent Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={startGuidedDemo}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700/80 shadow-md transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-current" />
              <span>3-Minute Guided Demo</span>
            </button>
          </div>

          {/* Core Pipeline Visual Flow */}
          <div className="pt-10">
            <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-800 inline-block w-full max-w-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 text-center">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Input</div>
                  <div className="text-xs font-extrabold text-white mt-0.5">Person & Evidence</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-teal-400 uppercase">Extraction</div>
                  <div className="text-xs font-extrabold text-white mt-0.5">Normalized Skills</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[10px] font-bold text-amber-400 uppercase">AI Inference</div>
                  <div className="text-xs font-extrabold text-amber-300 mt-0.5">Hidden Capabilities</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">Simulation</div>
                  <div className="text-xs font-extrabold text-white mt-0.5">What-If Growth</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">Outcome</div>
                  <div className="text-xs font-extrabold text-emerald-300 mt-0.5">Career Pathways</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Target Audiences Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Built for Every Career Milestone
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A person's potential is bigger than their job title or degree.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* For Students */}
          <div
            onClick={() => handleSelectPersona('Arjun', 'profile')}
            className="glass-card rounded-2xl p-6 border border-slate-800 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For Students & Freshers</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Understand your skills beyond your degree and discover suitable entry pathways."
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-950/60 text-[11px] text-slate-400">
                Demo: <strong className="text-white">Arjun Kumar</strong> (CS Undergrad $\to$ ML Engineer)
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-blue-400 flex items-center gap-1">
              <span>Explore Student Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* For Job Seekers */}
          <div
            onClick={() => handleSelectPersona('Priya', 'matching')}
            className="glass-card rounded-2xl p-6 border border-slate-800 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For Job Seekers</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Discover the roles you actually match and the skills you need to become job-ready."
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-950/60 text-[11px] text-slate-400">
                Demo: <strong className="text-white">Priya Sharma</strong> (Support $\to$ Data Analyst)
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-teal-400 flex items-center gap-1">
              <span>View Job Match Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* For Employees */}
          <div
            onClick={() => handleSelectPersona('Rahul', 'whatif')}
            className="glass-card rounded-2xl p-6 border border-slate-800 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For Existing Employees</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Discover internal opportunities and career transitions beyond your current job title."
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-950/60 text-[11px] text-slate-400">
                Demo: <strong className="text-white">Rahul Menon</strong> (Ops $\to$ Business Analyst)
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-purple-400 flex items-center gap-1">
              <span>Try What-If Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* For Organizations */}
          <div
            onClick={() => handleSelectPersona('Ananya', 'hr')}
            className="glass-card rounded-2xl p-6 border border-emerald-500/30 glow-emerald cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">For HR & Organizations</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                "Discover the talent and capabilities you already have hidden within your teams."
              </p>
              <div className="mt-4 p-2.5 rounded-lg bg-slate-950/60 text-[11px] text-slate-400">
                Demo: <strong className="text-white">Ananya HR</strong> (Workforce Skill Graph)
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Open HR Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Hidden Skill Discovery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Infers transferable analytical and problem-solving skills from project artifacts, customer tickets, and workflows rather than simple resume keyword hits.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Explainable Matching</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every compatibility score is mathematically transparent, citing specific verified evidence and explaining both strengths and missing prerequisites.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">What-If Career Simulator</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive simulation allows users to test skill additions (e.g. +Python, +Statistics) and immediately observe projected score increases and newly unlocked roles.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
