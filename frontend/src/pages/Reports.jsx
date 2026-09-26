import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import {
  BarChart3,
  Download,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await reportService.getSummary();
        setReportData(res.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-indigo-400 font-medium text-xs animate-pulse">
          Aggregating enterprise analytics and audit logs...
        </div>
      </div>
    );
  }

  const roleReports = reportData?.role_coverage_report || [];
  const security = reportData?.security_and_hallucinations || {};

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Executive Reports & Compliance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory policy compliance rates, traceability scores, and hallucination metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={reportService.exportCsvUrl}
            download
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
          <a
            href={reportService.exportJsonUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            JSON Report
          </a>
        </div>
      </div>

      {/* Security & Hallucination Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Total Flagged Items</span>
          <div className="text-2xl font-black text-amber-400 mt-2">{security.total_flagged_items || 0}</div>
          <p className="text-[11px] text-slate-400 mt-1">Adversarial & contradiction scans</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400">High-Risk Threats</span>
          <div className="text-2xl font-black text-rose-400 mt-2">{security.high_risk_threats || 0}</div>
          <p className="text-[11px] text-slate-400 mt-1">Quarantined from GenAI context</p>
        </div>

        <div className="glass-panel p-5">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Resolved Human Reviews</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">{security.resolved_reviews || 0}</div>
          <p className="text-[11px] text-slate-400 mt-1">Authorized & approved rollouts</p>
        </div>
      </div>

      {/* Role Compliance Coverage Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">Role-Level Mandatory Policy Coverage Audit</h2>
          <p className="text-xs text-slate-400">Ground-truth compliance averages across 10 job roles</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Job Role</th>
                <th className="px-5 py-3.5">Mandatory Matrix Requirements</th>
                <th className="px-5 py-3.5">Avg Mandatory Coverage</th>
                <th className="px-5 py-3.5">Avg Source Traceability</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {roleReports.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-white">{r.role_name}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-300">{r.mandatory_requirements} Items</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${r.average_coverage}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-emerald-400">{r.average_coverage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-cyan-400">{r.average_traceability}%</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      COMPLIANT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
