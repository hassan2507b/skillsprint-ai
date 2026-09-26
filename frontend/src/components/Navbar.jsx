import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, UserCircle, LogOut, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { currentUser, switchRole, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              SkillSprint <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI PowerPlay</span>
            </h1>
            <p className="text-xs text-slate-400">OnboardVerse Enterprise Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Center Role Quick-Switcher */}
      <div className="hidden md:flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400 px-2 font-medium">Switch Role:</span>
        <button
          onClick={() => switchRole('admin')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            currentUser?.role === 'admin'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => switchRole('manager')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            currentUser?.role === 'training_manager'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Manager
        </button>
        <button
          onClick={() => switchRole('reviewer')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            currentUser?.role === 'reviewer'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reviewer
        </button>
        <button
          onClick={() => switchRole('employee')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
            currentUser?.role === 'employee'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Employee
        </button>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center">
            {currentUser?.avatar || 'AU'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign out"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
