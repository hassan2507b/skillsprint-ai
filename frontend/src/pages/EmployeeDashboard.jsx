import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeService, planService, learnerService } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Target,
  ListTodo
} from 'lucide-react';

export const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [activeStage, setActiveStage] = useState('Day 1');
  const [loading, setLoading] = useState(true);

  // Quiz Modal State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const fetchLearnerData = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getAll();
      const emps = res.data.employees || [];
      if (emps.length > 0) {
        const empId = emps[0].id;
        const eRes = await employeeService.getById(empId);
        setEmployeeData(eRes.data);

        if (eRes.data.active_plan) {
          const planRes = await planService.getById(eRes.data.active_plan.id);
          setPlanDetails(planRes.data);
        }
      }
    } catch (err) {
      console.error('Error loading employee journey:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearnerData();
  }, [currentUser]);

  const handleToggleTask = async (taskId) => {
    try {
      await learnerService.toggleTask(taskId);
      fetchLearnerData();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleToggleChecklist = async (itemId) => {
    try {
      await learnerService.toggleChecklist(itemId);
      fetchLearnerData();
    } catch (err) {
      console.error('Failed to toggle checklist:', err);
    }
  };

  const handleQuizOptionSelect = (qIdx, optIdx) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = async () => {
    if (!activeQuiz) return;
    try {
      setSubmittingQuiz(true);
      const res = await learnerService.submitQuiz(activeQuiz.id, {
        employee_id: employeeData?.employee?.id || 1,
        answers: quizAnswers,
      });
      setQuizResult(res.data);
      fetchLearnerData();
    } catch (err) {
      console.error('Quiz submit failed:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-indigo-400 font-medium">
          <GraduationCap className="w-6 h-6 animate-bounce" />
          <span>Loading your personalized onboarding path...</span>
        </div>
      </div>
    );
  }

  const emp = employeeData?.employee;
  const plan = planDetails?.plan || employeeData?.active_plan;
  const modules = planDetails?.modules || [];
  const checklists = planDetails?.checklists || [];
  const tasks = planDetails?.tasks || [];
  const quizzes = planDetails?.quizzes || [];

  if (!emp) {
    return (
      <div className="glass-panel p-12 text-center text-xs text-slate-500 space-y-2">
        <GraduationCap className="w-8 h-8 text-slate-600 mx-auto" />
        <p className="font-bold text-slate-300">No Employee Profile Found</p>
        <p>Enroll an employee in the Employee Directory to start their onboarding journey.</p>
      </div>
    );
  }

  const stages = ['Day 1', 'Week 1', 'Week 2', 'First 30 Days', '60 Days', '90 Days'];

  // Filter items by stage
  const stageModules = modules.filter((m) => m.stage === activeStage || (activeStage === 'Day 1' && !m.stage));
  const stageChecklists = checklists.filter((c) => c.due_stage === activeStage || (activeStage === 'Day 1' && !c.due_stage));
  const stageTasks = tasks.filter((t) => t.due_stage === activeStage || (activeStage === 'Day 1' && !t.due_stage));

  // Progress metrics
  const completedChecklist = checklists.filter((c) => c.is_done).length;
  const totalChecklist = checklists.length || 1;
  const checklistPercent = Math.round((completedChecklist / totalChecklist) * 100);

  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const totalTasks = tasks.length || 1;
  const taskPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Personalized Plan: {plan?.plan_code || 'Pending Generation'}
            </span>
            {plan && <StatusBadge status={plan.status} />}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome, {emp.name}!
          </h1>
          <p className="text-xs text-slate-400">
            Role: <strong className="text-slate-200">{emp.role_name}</strong> • Department: <strong className="text-slate-200">{emp.department}</strong> • Experience Level: <strong className="text-slate-200">{emp.experience_level}</strong>
          </p>
        </div>

        {/* Overall Progress Gauge */}
        <div className="flex items-center gap-6 bg-slate-950/80 px-5 py-4 rounded-2xl border border-slate-800">
          <div className="text-center">
            <div className="text-2xl font-black text-indigo-400">{emp.plan_progress || checklistPercent}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Overall Progress</div>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-400">{plan?.coverage_score || 0}%</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Policy Coverage</div>
          </div>
        </div>
      </div>

      {/* Interactive Stage Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => setActiveStage(stage)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeStage === stage
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {stage}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Modules & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Modules */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  {activeStage} Learning Modules
                </h2>
                <p className="text-xs text-slate-400">Source-grounded curriculum designed for your role</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                {stageModules.length} Modules
              </span>
            </div>

            <div className="space-y-4 mt-4">
              {stageModules.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-500">No specific learning modules assigned for {activeStage}.</p>
              ) : (
                stageModules.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {m.module_code}
                          </span>
                          <span className="text-xs font-bold text-white">{m.title}</span>
                        </div>
                        <p className="text-xs text-slate-400">{m.purpose}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        {m.duration || '45 min'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between">
                      <div>
                        Source: <strong className="text-slate-200 font-mono">{m.source_doc_code}</strong> ({m.source_section})
                      </div>
                      <span className="text-emerald-400 font-semibold">Mandatory</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Practical Tasks */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  {activeStage} Practical Tasks
                </h2>
                <p className="text-xs text-slate-400">Actionable assignments to prove operational competence</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                {stageTasks.filter((t) => t.is_completed).length}/{stageTasks.length} Completed
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {stageTasks.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">No practical tasks due in {activeStage}.</p>
              ) : (
                stageTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTask(t.id)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-start gap-3 transition"
                  >
                    <button className="mt-0.5 text-indigo-400">
                      {t.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500" />
                      )}
                    </button>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${t.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {t.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {t.difficulty || 'Medium'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{t.description}</p>
                      <div className="text-[11px] text-cyan-400 pt-1">
                        Outcome: {t.expected_outcome}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Checklists & Quizzes */}
        <div className="space-y-6">
          {/* Action Checklists */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-indigo-400" />
                {activeStage} Checklist
              </h3>
              <span className="text-xs font-bold text-indigo-400">
                {stageChecklists.filter((c) => c.is_done).length}/{stageChecklists.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {stageChecklists.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">No checklist items for {activeStage}.</p>
              ) : (
                stageChecklists.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleToggleChecklist(c.id)}
                    className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center gap-3 transition"
                  >
                    <button className="text-indigo-400">
                      {c.is_done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={`text-xs ${c.is_done ? 'line-through text-slate-500' : 'text-slate-300 font-medium'}`}>
                        {c.activity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Interactive Quizzes */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Competency Quizzes
              </h3>
              <span className="text-xs font-semibold text-slate-400">{quizzes.length} Available</span>
            </div>

            <div className="space-y-3">
              {quizzes.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">No quizzes registered for this curriculum yet.</p>
              ) : (
                quizzes.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{q.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                        Pass: {q.passing_score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Module: {q.source_module}</p>
                    <button
                      onClick={() => {
                        setActiveQuiz(q);
                        setQuizAnswers({});
                        setQuizResult(null);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow"
                    >
                      Take Quiz Assessment
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">{activeQuiz.title}</h3>
                <p className="text-xs text-slate-400">Passing Score Threshold: {activeQuiz.passing_score}%</p>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {quizResult ? (
              <div className={`p-5 rounded-2xl border text-center space-y-3 ${
                quizResult.passed ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' : 'bg-rose-950/50 border-rose-800 text-rose-300'
              }`}>
                <div className="text-3xl font-black">{quizResult.score}%</div>
                <div className="font-bold text-sm">
                  {quizResult.passed ? '🎉 Assessment Passed!' : '⚠️ Assessment Threshold Not Met'}
                </div>
                <p className="text-xs text-slate-300">
                  You answered {quizResult.correct_count} of {quizResult.total_questions} questions correctly.
                </p>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {(activeQuiz.questions || []).map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-xs font-bold text-slate-200">
                      {qIdx + 1}. {q.question}
                    </div>
                    <div className="space-y-1.5">
                      {(q.options || []).map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                            quizAnswers[qIdx] === optIdx
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${qIdx}`}
                            checked={quizAnswers[qIdx] === optIdx}
                            onChange={() => handleQuizOptionSelect(qIdx, optIdx)}
                            className="text-indigo-600 focus:ring-0"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleQuizSubmit}
                  disabled={submittingQuiz || Object.keys(quizAnswers).length === 0}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  {submittingQuiz ? 'Submitting Answers...' : 'Submit Assessment Answers'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
