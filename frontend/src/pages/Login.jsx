import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Shield,
  User,
  Lock,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Inbox
} from 'lucide-react';

export const Login = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'employee') {
        navigate('/employee');
      } else {
        navigate('/');
      }
    } else {
      setError(res.error);
    }
  };

  const handleQuickLogin = (roleKey) => {
    switchRole(roleKey);
    if (roleKey === 'employee') {
      navigate('/employee');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            SkillSprint <span className="text-indigo-400">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Onboarding & Training Intelligence Platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to SkillSprint AI'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Login Switchers */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">
              1-Click Instant Evaluator Logins:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 text-left transition flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <div>
                  <div className="text-[11px] font-bold text-slate-200">Admin</div>
                  <div className="text-[9px] text-slate-400">Full System Access</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('reviewer')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 text-left transition flex items-center gap-2"
              >
                <Inbox className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <div className="text-[11px] font-bold text-slate-200">Reviewer</div>
                  <div className="text-[9px] text-slate-400">Review & Override</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 text-left transition flex items-center gap-2"
              >
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <div>
                  <div className="text-[11px] font-bold text-slate-200">Manager</div>
                  <div className="text-[9px] text-slate-400">Training & Plans</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('employee')}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 text-left transition flex items-center gap-2"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <div className="text-[11px] font-bold text-slate-200">Employee</div>
                  <div className="text-[9px] text-slate-400">Abdul Raheem</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
