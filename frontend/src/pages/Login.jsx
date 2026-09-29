import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  User,
  Lock,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Inbox
} from 'lucide-react';
import logo from '../assets/logo.png';

export const Login = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center shadow-xl shadow-brand-500/20 overflow-hidden border border-slate-100">
            <img src={logo} alt="SkillSprint Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            SkillSprint <span className="text-slate-9000">AI</span>
          </h1>
          <p className="text-xs text-slate-600/70">
            Enterprise Onboarding & Training Intelligence Platform
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-6 space-y-5 border border-slate-200/20 shadow-xl">
          {error && (
            <div className="p-3 rounded-xl bg-slate-50/60 border border-brand-200 text-xs text-slate-600 font-semibold shadow-inner">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600/90 mb-1">Email</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600/50" />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/20 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600/90 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/20 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-500 hover:bg-brand-500/80 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to SkillSprint AI'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
