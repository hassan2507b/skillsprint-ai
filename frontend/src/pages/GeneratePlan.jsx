import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { employeeService, roleService, planService } from '../services/api';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const GeneratePlan = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultRole = searchParams.get('role') || '';
  const defaultEmpId = searchParams.get('empId') || '';

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState(defaultEmpId);
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Flash (Source-Grounded)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [resultPlan, setResultPlan] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eRes, rRes] = await Promise.all([
          employeeService.getAll(),
          roleService.getAll()
        ]);
        setEmployees(eRes.data.employees || []);
        setRoles(rRes.data.roles || []);

        if (!selectedRole && rRes.data.roles?.length > 0) {
          setSelectedRole(rRes.data.roles[0].role_name);
        }
        if (!selectedEmpId && eRes.data.employees?.length > 0) {
          setSelectedEmpId(eRes.data.employees[0].id);
        }
      } catch (err) {
        console.error('Failed to load generate options:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEmpChange = (empId) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => String(e.id) === String(empId));
    if (emp) {
      setSelectedRole(emp.role_name);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      setGenerationStep('Retrieving Ground-Truth Role Matrix and Active Source Chunks...');
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStep('Invoking Pipeline 1 (GenAI Curriculum Synthesis & Stage Sequencing)...');
      await new Promise((r) => setTimeout(r, 800));

      const payload = {
        employee_id: selectedEmpId ? parseInt(selectedEmpId) : null,
        role_name: selectedRole,
      };

      setGenerationStep('Running Pipeline 2 (Independent Python Validation Engine)...');
      const res = await planService.generate(payload);
      setResultPlan(res.data);
      setGenerationStep('Generation & Validation Complete!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Plan generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Generate Personalized Onboarding Plan</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-Pipeline synthesis: GenAI model drafting + independent deterministic Python ground-truth verification
            </p>
          </div>
        </div>
      </div>

      {/* Generator Form Card */}
      <div className="glass-panel p-6 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Employee
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => handleEmpChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.role_name} - {e.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Job Role & Matrix Mapping
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.role_name}>
                    {r.role_name} ({r.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Generative AI Engine
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Gemini 1.5 Flash (Source-Grounded)">Gemini 1.5 Flash (Source-Grounded)</option>
                <option value="Gemini Pro (Multi-Stage Reasoning)">Gemini Pro (Multi-Stage Reasoning)</option>
                <option value="Deterministic Grounded Engine">Deterministic Grounded Engine</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Configured Chronological Stages
              </label>
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800">Day 1</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800">Week 1</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800">Week 2</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800">30 Days</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800">60 Days</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800">90 Days</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Automated Ground-Truth Enforcement Pipeline:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li>Applies prompt injection defense & active document sandboxing</li>
              <li>Generates structured JSON schema with learning objectives, tasks, quizzes, and rubrics</li>
              <li>Runs independent Python rule engine calculating coverage and source traceability</li>
            </ul>
          </div>

          {isGenerating ? (
            <div className="p-5 bg-indigo-950/30 border border-indigo-800/50 rounded-xl text-center space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-indigo-300 animate-pulse">{generationStep}</p>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Generate & Validate Onboarding Plan
            </button>
          )}
        </form>

        {/* Result Preview Card */}
        {resultPlan && (
          <div className="p-6 bg-slate-950/80 border border-emerald-800/60 rounded-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Plan #{resultPlan.plan_code} Synthesized & Verified
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                {resultPlan.validation?.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xl font-bold text-emerald-400">{resultPlan.validation?.coverage_score}%</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Mandatory Coverage</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xl font-bold text-cyan-400">{resultPlan.validation?.traceability_score}%</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Source Traceability</div>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-xl font-bold text-indigo-400">{resultPlan.plan?.modules?.length || 0}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Modules Generated</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => navigate(`/plans/${resultPlan.plan_id}`)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                Inspect Plan Curriculum <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
