import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { planService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  FileCheck,
  TrendingUp,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';

export const ValidationDashboard = () => {
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get('planId') || '';

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await planService.getAll();
        setPlans(res.data.plans || []);
        if (!selectedPlanId && res.data.plans?.length > 0) {
          setSelectedPlanId(res.data.plans[0].id);
        }
      } catch (err) {
        console.error('Failed to load plans for validation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlanId) {
      runValidation(selectedPlanId);
    }
  }, [selectedPlanId]);

  const runValidation = async (planId) => {
    try {
      setValidating(true);
      const res = await planService.validate(planId);
      setValidationResult(res.data.validation);
    } catch (err) {
      console.error('Validation execution error:', err);
    } finally {
      setValidating(false);
    }
  };

  const val = validationResult || {};
  const missing = val.missing_mandatory_trainings || [];
  const unsupported = val.unsupported_items || [];
  const contradictions = val.contradictions || [];
  const adversarial = val.adversarial_warnings || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Independent Python Ground-Truth Validation Pipeline (Pipeline 2)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zero-LLM deterministic audit: computes coverage, source citations, sequencing, and contradictions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.plan_code} - {p.role_name} ({p.employee_name || 'Employee'})
              </option>
            ))}
          </select>

          <button
            onClick={() => runValidation(selectedPlanId)}
            disabled={validating}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${validating ? 'animate-spin' : ''}`} />
            Re-Run Python Rules
          </button>
        </div>
      </div>

      {/* Validation Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Mandatory Coverage</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{val.coverage_score || 0}%</span>
            <span className="text-xs text-slate-400">({val.covered_mandatory_count || 0}/{val.total_required_mandatory || 0})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ground-truth matrix matched</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Source Traceability</span>
            <FileCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">{val.traceability_score || 0}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Active Docs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Grounded in repository chunks</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Contradictions</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{contradictions.length}</span>
            <span className="text-xs text-slate-400">Precedence Applied</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Conflicting clauses identified</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Pipeline Status</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <StatusBadge status={val.status} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Overall Decision Engine</p>
        </div>
      </div>

      {/* Warnings & Diagnostics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missing Requirements */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              Missing Mandatory Requirements ({missing.length})
            </h2>
            <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
              {missing.length === 0 ? 'Zero Missing' : 'Action Required'}
            </span>
          </div>

          <div className="space-y-3">
            {missing.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto" />
                <p className="font-bold">100% Mandatory Requirement Coverage Achieved!</p>
                <p className="text-[11px] text-slate-400">Every ground-truth matrix requirement is satisfied in this plan.</p>
              </div>
            ) : (
              missing.map((m, idx) => (
                <div key={idx} className="p-3.5 bg-slate-950/60 border border-rose-900/50 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-400">{m.req_code}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{m.priority}</span>
                  </div>
                  <p className="text-slate-200 font-medium">{m.requirement}</p>
                  <p className="text-[11px] text-slate-400">Source: <span className="text-indigo-300">{m.source_doc}</span></p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contradictions & Security */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Contradictions & Adversarial Scan
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {contradictions.length + adversarial.length} Warnings
            </span>
          </div>

          <div className="space-y-3">
            {contradictions.length === 0 && adversarial.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 rounded-xl space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto" />
                <p className="font-bold">Zero Policy Contradictions or Injections</p>
                <p className="text-[11px] text-slate-400">All modules align with active v2.0 corporate policies.</p>
              </div>
            ) : (
              <>
                {contradictions.map((c, i) => (
                  <div key={i} className="p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-300 font-bold">
                      <span>Conflict: {c.conflict_id}</span>
                      <span className="text-[10px] uppercase">{c.risk} Risk</span>
                    </div>
                    <p className="text-slate-200">{c.issue}</p>
                    <p className="text-[11px] text-emerald-400 font-medium">Resolution: {c.remedy}</p>
                  </div>
                ))}

                {adversarial.map((a, i) => (
                  <div key={i} className="p-3.5 bg-rose-950/30 border border-rose-800/60 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-rose-300 font-bold">
                      <span>Adversarial Injection Pattern</span>
                      <span>Line #{a.line_number}</span>
                    </div>
                    <p className="text-slate-200 font-mono">"{a.snippet}"</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
