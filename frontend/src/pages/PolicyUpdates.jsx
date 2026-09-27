import React, { useEffect, useState } from 'react';
import { policyService, documentService } from '../services/api';
import {
  RefreshCw,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Users,
  BookOpen,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const PolicyUpdates = () => {
  const [documents, setDocuments] = useState([]);
  const [docCode, setDocCode] = useState('');
  const [newVersion, setNewVersion] = useState('2.0');
  const [impactData, setImpactData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenResult, setRegenResult] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await documentService.getAll();
        const docs = res.data.documents || [];
        setDocuments(docs);
        if (docs.length > 0) {
          setDocCode(docs[0].doc_code);
        }
      } catch (err) {
        console.error('Failed to load documents for policy updates:', err);
      }
    };
    fetchDocs();
  }, []);

  const handleRunImpactAnalysis = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!docCode) return;
    try {
      setAnalyzing(true);
      setRegenResult(null);
      const res = await policyService.impactAnalysis({
        doc_code: docCode,
        new_version: newVersion
      });
      setImpactData(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Impact analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectiveRegenerate = async () => {
    if (!docCode) return;
    try {
      setRegenerating(true);
      const res = await policyService.selectiveRegenerate({
        doc_code: docCode,
        new_version: newVersion
      });
      setRegenResult(res.data);
      // Refresh impact data
      handleRunImpactAnalysis({});
    } catch (err) {
      alert(err.response?.data?.detail || 'Selective regeneration failed');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="glass-panel p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Policy Update Detection & Impact Analysis</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate document version changes (v1.0 → v2.0), isolate impacted curriculum elements, and execute Selective Regeneration
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="glass-panel p-6 space-y-4">
        <form onSubmit={handleRunImpactAnalysis} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Updated Document Code</label>
            <select
              value={docCode}
              onChange={(e) => setDocCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              {documents.length === 0 ? (
                <option value="">No documents uploaded yet</option>
              ) : (
                documents.map((d) => (
                  <option key={d.id} value={d.doc_code}>
                    {d.doc_code} ({d.title})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Active Version</label>
            <input
              type="text"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing || !docCode}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {analyzing ? 'Scanning Repositories...' : 'Execute Impact Analysis'}
          </button>
        </form>
      </div>

      {/* Impact Analysis Results */}
      {impactData && (
        <div className="space-y-6 animate-fadeIn">
          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5">
              <span className="text-[11px] font-semibold uppercase text-slate-400">Affected Modules</span>
              <div className="text-2xl font-black text-amber-400 mt-2">{impactData.total_affected_modules}</div>
              <p className="text-[11px] text-slate-400 mt-1">Directly referencing {docCode}</p>
            </div>

            <div className="glass-panel p-5">
              <span className="text-[11px] font-semibold uppercase text-slate-400">Affected Employees</span>
              <div className="text-2xl font-black text-rose-400 mt-2">{impactData.affected_employees_count}</div>
              <p className="text-[11px] text-slate-400 mt-1">Requiring curriculum revision</p>
            </div>

            <div className="glass-panel p-5">
              <span className="text-[11px] font-semibold uppercase text-slate-400">Affected Quizzes</span>
              <div className="text-2xl font-black text-cyan-400 mt-2">{impactData.total_affected_quizzes}</div>
              <p className="text-[11px] text-slate-400 mt-1">Questions referencing old version</p>
            </div>
          </div>

          {/* Selective Regeneration Trigger */}
          <div className="glass-panel p-6 bg-amber-950/20 border-amber-800/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-amber-300">Selective Regeneration</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Regenerates ONLY the {impactData.total_affected_modules} affected modules without invalidating unchanged training tracks.
                </p>
              </div>

              <button
                onClick={handleSelectiveRegenerate}
                disabled={regenerating || impactData.total_affected_modules === 0}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-amber-600/30 flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                {regenerating ? 'Regenerating Affected Modules...' : 'Run Selective Regeneration'}
              </button>
            </div>

            {regenResult && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {regenResult.message}
              </div>
            )}
          </div>

          {/* Detailed Affected Items Table */}
          <div className="glass-panel p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Affected Learning Modules Breakdown</h3>
            <div className="divide-y divide-slate-800">
              {(impactData.affected_modules || []).length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">No active learning modules are affected by this update.</p>
              ) : (
                (impactData.affected_modules || []).map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{m.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Employee: <strong className="text-slate-200">{m.employee_name}</strong> • Role: {m.role_name} • Stage: {m.stage}
                      </div>
                    </div>
                    <span className="font-mono text-indigo-400 font-bold">{m.module_code}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
