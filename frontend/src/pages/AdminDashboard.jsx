import React, { useEffect, useState } from 'react';
import { statsService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Layers,
  Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await statsService.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-indigo-400 font-medium">
          <Activity className="w-6 h-6 animate-spin" />
          <span>Synthesizing enterprise metrics...</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentPlans = data?.recent_plans || [];
  const recentReviews = data?.recent_reviews || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Apex Global Enterprise Knowledge Mesh
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Onboarding Intelligence Hub</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Source-grounded curriculum generation with independent Python rule validation, strict prompt injection defense, and 100% matrix compliance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              <Sparkles className="w-4 h-4" />
              Generate Plan
            </Link>
            <Link
              to="/validation"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              Run Validation
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Documents</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats.total_documents || 0}</span>
            <span className="text-xs text-emerald-400 font-medium">({stats.active_documents || 0} Active)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Policies, SOPs, FAQs & Handbooks</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Matrix Requirements</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats.total_matrix_requirements || 0}</span>
            <span className="text-xs text-indigo-400 font-medium">{stats.mandatory_requirements || 0} Mandatory</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 10 standard job roles</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Avg Mandatory Coverage</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{stats.average_coverage_score || 0}%</span>
            <span className="text-xs text-slate-400 font-medium">Target 100%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Python Ground-Truth Verified</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Review Queue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{stats.pending_reviews || 0}</span>
            <span className="text-xs text-slate-400 font-medium">Flagged Items</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting Human Review</p>
        </div>
      </div>

      {/* Dual Pipeline Architecture Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Generated Plans */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Recent Generated Onboarding Plans</h2>
              <p className="text-xs text-slate-400">Multi-stage curriculums verified against Ground Truth</p>
            </div>
            <Link to="/approved-plans" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 mt-2">
            {recentPlans.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">No onboarding plans generated yet.</p>
            ) : (
              recentPlans.map((plan) => (
                <div key={plan.id} className="py-3.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-lg transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{plan.employee_name || 'Employee'}</span>
                      <span className="text-[11px] text-slate-400">({plan.role_name})</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Code: <strong className="text-slate-300">{plan.plan_code}</strong></span>
                      <span>Coverage: <strong className="text-emerald-400">{plan.coverage_score}%</strong></span>
                      <span>Traceability: <strong className="text-cyan-400">{plan.traceability_score}%</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={plan.status} />
                    <Link
                      to={`/plans/${plan.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition text-xs font-medium"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Human Review & Policy Queue */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-200">Active Review & Escalation Queue</h2>
              <p className="text-xs text-slate-400">Security scans, contradictions & missing requirements</p>
            </div>
            <Link to="/reviews" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Open Queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800/80 mt-2">
            {recentReviews.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">Review queue is currently clear.</p>
            ) : (
              recentReviews.map((rev) => (
                <div key={rev.id} className="py-3.5 space-y-1.5 hover:bg-slate-800/30 px-2 rounded-lg transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{rev.employee_name} ({rev.role_name})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      rev.risk_flag === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {rev.risk_flag} risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{rev.flag_reason}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
