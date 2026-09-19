import React from 'react';
import { useAppState } from '../../services/stateContext';
import {
  Sparkles,
  UserCheck,
  ShieldAlert,
  Compass,
  GitBranch,
  Layers,
  Zap,
  Map,
  Bot,
  BarChart3,
  Settings,
  ChevronDown,
  Activity,
  Play
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    demoUsers,
    activeTab,
    setActiveTab,
    startGuidedDemo,
    systemStatus,
    setIsResponsibleModalOpen
  } = useAppState();

  const isHR = currentUser?.user_type === 'hr_admin';

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'profile', label: 'My Talent Profile', icon: UserCheck },
    { id: 'graph', label: 'Skills Graph', icon: GitBranch },
    { id: 'matching', label: 'Role Matches', icon: Sparkles },
    { id: 'gaps', label: 'Skill Gaps', icon: Layers },
    { id: 'whatif', label: 'What-If Simulator', icon: Zap },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'hr', label: 'HR Intelligence', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-bold text-xl">
              TL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  TALENT<span className="text-emerald-400">LENS</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Talent Discovery & Career Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              // Dim HR tab for non-HR or highlight
              const isHighlight = item.id === 'whatif' || item.id === 'matching';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* 1-Click Guided Demo Button */}
            <button
              onClick={startGuidedDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>3-Min Demo</span>
            </button>

            {/* AI Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{systemStatus.ai_mode}</span>
            </div>

            {/* Responsible AI Button */}
            <button
              onClick={() => setIsResponsibleModalOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900/80 transition-colors border border-transparent hover:border-slate-800"
              title="Responsible AI & Transparency"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={currentUser?.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">{currentUser?.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{currentUser?.current_title || 'Role'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                  Switch Demo Persona
                </div>
                {demoUsers.slice(0, 5).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      if (user.user_type === 'hr_admin') {
                        setActiveTab('hr');
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-800/60 transition-colors ${
                      currentUser?.id === user.id ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300'
                    }`}
                  >
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-semibold">{user.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {user.current_title} • <span className="capitalize">{user.user_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
