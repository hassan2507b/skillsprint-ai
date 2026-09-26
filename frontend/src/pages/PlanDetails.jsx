import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck,
  ShieldCheck,
  GitCompare,
  HelpCircle,
  Target,
  Sparkles,
  Award,
  Trash2
} from 'lucide-react';

export const PlanDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('All Stages');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await planService.getById(id);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching plan details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-indigo-400 font-medium text-xs animate-pulse">
          Loading curriculum architecture and module assessments...
        </div>
      </div>
    );
  }

  const plan = data?.plan || {};
  const modules = data?.modules || [];
  const checklists = data?.checklists || [];
  const tasks = data?.tasks || [];
  const quizzes = data?.quizzes || [];
  const assessments = data?.assessments || [];
  const validation = data?.validation || {};

  const stages = ['All Stages', 'Day 1', 'Week 1', 'Week 2', 'First 30 Days', '60 Days', '90 Days'];

  const filteredModules = selectedStage === 'All Stages'
    ? modules
    : modules.filter((m) => m.stage === selectedStage);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/approved-plans"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Plans
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/validation?planId=${plan.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Python Validation
          </Link>
          <Link
            to={`/comparison?planId=${plan.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            <GitCompare className="w-3.5 h-3.5" />
            100-Point Comparison
          </Link>
          <button
            onClick={async () => {
              if (!window.confirm('Are you sure you want to permanently delete this onboarding plan?')) return;
              try {
                await planService.delete(plan.id);
                window.location.href = '/approved-plans';
              } catch (err) {
                alert(err.response?.data?.detail || 'Failed to delete plan');
              }
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
            title="Delete Plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Plan Header Card */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-indigo-400 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                {plan.plan_code}
              </span>
              <StatusBadge status={plan.status} />
              <span className="text-xs text-slate-400 font-medium">
                Engine: <strong className="text-slate-200">{plan.generation_source || 'Gemini 1.5 Flash'}</strong>
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {plan.role_name} Personalized Onboarding Curriculum
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
            <div>
              <div className="text-xl font-bold text-emerald-400">{plan.coverage_score}%</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Coverage</div>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <div className="text-xl font-bold text-cyan-400">{plan.traceability_score}%</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Traceability</div>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <div className="text-xl font-bold text-indigo-400">{modules.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Modules</div>
            </div>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-800">
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStage === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {filteredModules.map((m) => {
          let objectives = [];
          try {
            objectives = typeof m.learning_objectives === 'string' ? JSON.parse(m.learning_objectives) : m.learning_objectives;
          } catch {
            objectives = [];
          }

          let concepts = [];
          try {
            concepts = typeof m.key_concepts === 'string' ? JSON.parse(m.key_concepts) : m.key_concepts;
          } catch {
            concepts = [];
          }

          return (
            <div key={m.id} className="glass-panel p-6 space-y-4 hover:border-indigo-500/40 transition">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {m.module_code}
                    </span>
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{m.purpose}</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-950 font-semibold text-cyan-400 border border-slate-800">
                    Stage: {m.stage}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {m.duration}
                  </span>
                </div>
              </div>

              {/* Objectives & Concepts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Learning Objectives</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                    {objectives?.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Source Grounding</span>
                  <p className="text-slate-300 text-[11px]">
                    Document: <strong className="text-white">{m.source_doc_code}</strong> ({m.source_section})
                  </p>
                  <p className="text-slate-400 text-[10px] mt-1">
                    Key Concepts: {concepts?.join(', ') || 'Domain Protocols'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
