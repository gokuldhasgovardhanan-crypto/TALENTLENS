import React, { useState } from 'react';
import { useNavigate } from '../../services/router';
import { useAuth, UserRole } from '../../services/authContext';
import { Sparkles, GraduationCap, Briefcase, UserCheck, ShieldCheck, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, loginAsDemoUser } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('job_seeker');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoRoles = [
    {
      role: 'student' as UserRole,
      title: 'Student / Graduate',
      name: 'Arjun Kumar',
      email: 'student@talentlens.demo',
      desc: 'Academic projects, skill gap analysis & internship discovery',
      icon: GraduationCap,
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      role: 'job_seeker' as UserRole,
      title: 'Job Seeker',
      name: 'Priya Sharma',
      email: 'jobseeker@talentlens.demo',
      desc: 'Resume parsing, multi-factor job matching & career roadmaps',
      icon: Briefcase,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      role: 'employee' as UserRole,
      title: 'Internal Employee',
      name: 'Rahul Menon',
      email: 'employee@talentlens.demo',
      desc: 'Internal mobility, readiness scoring & promotion path simulator',
      icon: UserCheck,
      color: 'from-purple-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400',
    },
    {
      role: 'hr' as UserRole,
      title: 'HR / Recruiter',
      name: 'Ananya HR',
      email: 'hr@talentlens.demo',
      desc: 'Open role publisher, talent candidate pipeline & candidate ranking',
      icon: ShieldCheck,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    },
  ];

  const handleDemoLogin = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await loginAsDemoUser(role);
      redirectUser(role);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || !password) {
          setError('Please fill out all fields.');
          setLoading(false);
          return;
        }
        await register(email, password, fullName, selectedRole);
        redirectUser(selectedRole);
      } else {
        if (!email.trim() || !password) {
          setError('Please provide email and password.');
          setLoading(false);
          return;
        }
        const loggedInUser = await login(email, password);
        redirectUser(loggedInUser.role);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role: UserRole) => {
    switch (role) {
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'job_seeker':
        navigate('/job-seeker/dashboard');
        break;
      case 'employee':
        navigate('/employee/dashboard');
        break;
      case 'hr':
        navigate('/hr/dashboard');
        break;
      default:
        navigate('/job-seeker/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Talent Intelligence Engine v2.0</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
          TALENTLENS
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Role-Based AI Talent Discovery & Career Intelligence Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl px-4">
        {/* Quick Demo Switcher Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1-Click Hackathon Demo Login</span>
            </h2>
            <span className="text-xs text-slate-500">Select any persona to jump directly to dashboard</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoRoles.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.role}
                  onClick={() => handleDemoLogin(demo.role)}
                  disabled={loading}
                  className={`p-4 rounded-2xl border bg-gradient-to-b ${demo.color} hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex flex-col justify-between group disabled:opacity-50`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-6 h-6" />
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="font-bold text-white text-base">{demo.title}</div>
                    <div className="text-xs text-slate-300 font-medium mb-2">{demo.name}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{demo.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{demo.email}</span>
                    <span className="font-semibold text-cyan-400">Demo Login →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standard Auth Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl">
          <div className="flex justify-center space-x-4 mb-6 border-b border-slate-800 pb-4">
            <button
              onClick={() => setIsRegister(false)}
              className={`text-sm font-semibold pb-1 transition-colors ${
                !isRegister ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`text-sm font-semibold pb-1 transition-colors ${
                isRegister ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register New Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="student">Student / Fresh Graduate</option>
                    <option value="job_seeker">Job Seeker</option>
                    <option value="employee">Internal Employee</option>
                    <option value="hr">HR / Recruiter</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-950 font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Continue' : 'Sign In to TalentLens'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
