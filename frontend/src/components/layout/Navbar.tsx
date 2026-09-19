import React from 'react';
import { Link, useNavigate, useLocation } from '../../services/router';
import { useAuth } from '../../services/authContext';
import { Sparkles, LogOut, User as UserIcon, ShieldCheck, GraduationCap, Briefcase, UserCheck, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'student':
        return { label: 'Student / Graduate', icon: GraduationCap, color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' };
      case 'job_seeker':
        return { label: 'Job Seeker', icon: Briefcase, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
      case 'employee':
        return { label: 'Internal Employee', icon: UserCheck, color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' };
      case 'hr':
        return { label: 'HR Recruiter', icon: ShieldCheck, color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
      default:
        return { label: 'User', icon: UserIcon, color: 'bg-slate-800 text-slate-300' };
    }
  };

  const getRoleDashboardPath = (role: string) => {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'job_seeker':
        return '/job-seeker/dashboard';
      case 'employee':
        return '/employee/dashboard';
      case 'hr':
        return '/hr/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={user ? getRoleDashboardPath(user.role) : '/login'} className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                TALENTLENS
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest -mt-1">
                TALENT INTELLIGENCE PLATFORM
              </span>
            </div>
          </Link>

          {/* Right User State */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Active Role Badge */}
                {(() => {
                  const badge = getRoleBadge(user.role);
                  const Icon = badge.icon;
                  return (
                    <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badge.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}

                {/* Dashboard Link */}
                <Link
                  to={getRoleDashboardPath(user.role)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    location.pathname.includes('/dashboard')
                      ? 'bg-slate-800 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>

                {/* Profile info & Logout */}
                <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
                  <div className="hidden lg:block text-right">
                    <div className="text-xs font-bold text-white leading-tight">{user.full_name || user.name}</div>
                    <div className="text-[10px] text-slate-400">{user.email}</div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Sign In / Demo Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
