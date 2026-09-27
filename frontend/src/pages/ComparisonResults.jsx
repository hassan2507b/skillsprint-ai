import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { comparisonService } from '../services/api';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Sparkles,
  Layers
} from 'lucide-react';

export const ComparisonResults = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');

  const [multiRoleReport, setMultiRoleReport] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
  const [matchStatusFilter, setMatchStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const res = await comparisonService.getMultiRole();
        setMultiRoleReport(res.data);
      } catch (err) {
        console.error('Failed to load comparison data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparisonData();
  }, [planId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-indigo-400 font-medium text-xs animate-pulse">
          Computing requirement-level GenAI vs Python Ground-Truth comparison metrics...
        </div>
      </div>
    );
  }

  const roleReports = multiRoleReport?.role_reports || [];
  
  // Flatten comparison rows from all role reports
  let allRows = [];
  roleReports.forEach((rep) => {
    (rep.comparison_rows || []).forEach((row) => {
      allRows.push(row);
    });
  });

  const filteredRows = allRows.filter((row) => {
    const matchesRole = !selectedRoleFilter || row.role === selectedRoleFilter;
    const matchesStatus = !matchStatusFilter || row.match_status === matchStatusFilter;
    return matchesRole && matchesStatus;
  });

  const totalMatches = allRows.filter((r) => r.match_status === 'Match').length;
  const overallRate = allRows.length > 0 ? Math.round((totalMatches / allRows.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-5 h-5 text-indigo-400" />
            GenAI vs Python Ground-Truth Comparison Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Auditing requirement-level decisions across standard job roles (SRS Deliverable 6)
          </p>
        </div>

        <a
          href="/api/reports/export?format=csv"
          download
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export Comparison (CSV)
        </a>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Total Requirements Audited</span>
          <div className="text-2xl font-black text-white mt-2">{allRows.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Dynamic Evaluation Benchmark</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400">GenAI / Python Match Rate</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">{overallRate}%</div>
          <p className="text-[11px] text-slate-400 mt-1">{totalMatches} of {allRows.length} Requirements Matched</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Roles Evaluated</span>
          <div className="text-2xl font-black text-indigo-400 mt-2">{roleReports.length} Roles</div>
          <p className="text-[11px] text-slate-400 mt-1">All Enterprise Departments Covered</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="">All Job Roles ({roleReports.length})</option>
            {roleReports.map((r, i) => (
              <option key={i} value={r.role}>{r.role}</option>
            ))}
          </select>

          <select
            value={matchStatusFilter}
            onChange={(e) => setMatchStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="">All Match Statuses</option>
            <option value="Match">Match</option>
            <option value="Mismatch (Missing in AI Plan)">Mismatch (Missing)</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-white">{filteredRows.length}</strong> requirement comparison items
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Req Code & Role</th>
                <th className="px-4 py-3.5">Python Ground-Truth Expected</th>
                <th className="px-4 py-3.5">GenAI Pipeline Output</th>
                <th className="px-4 py-3.5">Match Status</th>
                <th className="px-4 py-3.5">Traceability</th>
                <th className="px-4 py-3.5">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No comparison data available. Generate an onboarding plan to trigger comparison.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 space-y-0.5">
                      <div className="font-mono font-bold text-indigo-400">{row.req_code}</div>
                      <div className="font-semibold text-white">{row.role}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-200 max-w-xs font-medium">
                      {row.python_expected}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 max-w-xs">
                      {row.genai_result}
                    </td>
                    <td className="px-4 py-3.5">
                      {row.match_status === 'Match' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> MATCH
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          <XCircle className="w-3 h-3" /> MISMATCH
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-cyan-400 font-medium text-[11px]">{row.traceability_status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-[11px] max-w-xs">
                      {row.explanation}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
