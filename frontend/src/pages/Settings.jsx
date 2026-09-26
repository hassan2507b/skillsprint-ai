import React, { useState } from 'react';
import { promptService } from '../services/api';
import { Settings as SettingsIcon, Shield, RefreshCw, Key, CheckCircle2 } from 'lucide-react';

export const Settings = () => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset and re-seed the SQLite database with 10 standard roles, 40 documents, and 150+ ground-truth requirements?')) return;
    try {
      setResetting(true);
      setResetSuccess(false);
      await promptService.resetSystem();
      setResetSuccess(true);
    } catch (err) {
      alert('Failed to reset system: ' + (err.response?.data?.detail || err.message));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/40">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          System Settings & Enterprise Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Precedence hierarchies, Generative AI models, and database re-seeding controls
        </p>
      </div>

      {/* Precedence Hierarchy Order */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Configured Policy Precedence Hierarchy
        </h2>
        <p className="text-xs text-slate-400">
          When conflicts or outdated policies are detected during synthesis, precedence order determines authoritative rules:
        </p>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-white">Tier 1: Approved Corporate Policy (Latest Active Version)</span>
            <span className="text-emerald-400 font-semibold text-[10px] uppercase">Highest Precedence</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-white">Tier 2: Regulatory & Legal Compliance Directives</span>
            <span className="text-emerald-400 font-semibold text-[10px] uppercase">Tier 2</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-white">Tier 3: Department Standard Operating Procedures (SOPs)</span>
            <span className="text-cyan-400 font-semibold text-[10px] uppercase">Tier 3</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-white">Tier 4: Official Employee Handbook</span>
            <span className="text-indigo-400 font-semibold text-[10px] uppercase">Tier 4</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-white">Tier 5: Frequently Asked Questions (FAQ)</span>
            <span className="text-amber-400 font-semibold text-[10px] uppercase">Tier 5</span>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="font-bold text-white">Tier 6: Informal Departmental Guidance</span>
            <span className="text-slate-500 font-semibold text-[10px] uppercase">Lowest Precedence</span>
          </div>
        </div>
      </div>

      {/* Database Reset & Reseed */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          Reset & Re-Seed SQLite Database
        </h2>
        <p className="text-xs text-slate-400">
          Reinitializes all 22 database tables and seeds 10 job roles, 40 documents, 150+ ground-truth requirements, and evaluation review queues.
        </p>

        {resetSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Database reset and re-seeded successfully!
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          {resetting ? 'Re-Seeding 22 SQLite Tables...' : 'Reset & Re-Seed Database'}
        </button>
      </div>
    </div>
  );
};
