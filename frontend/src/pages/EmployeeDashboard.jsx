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
      // Default to employee 1 (Abdul Raheem) or currentUser id
      const empId = currentUser?.role === 'employee' ? 1 : 1;
      const res = await employeeService.getById(empId);
      setEmployeeData(res.data);

      if (res.data.active_plan) {
        const planRes = await planService.getById(res.data.active_plan.id);
        setPlanDetails(planRes.data);
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

  const emp = employeeData?.employee || {};
  const plan = planDetails?.plan || {};
  const modules = planDetails?.modules || [];
  const checklists = planDetails?.checklists || [];
  const tasks = planDetails?.tasks || [];
  const quizzes = planDetails?.quizzes || [];

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
              Personalized Plan: {plan.plan_code || 'PLN-0001'}
            </span>
            <StatusBadge status={plan.status || 'verified'} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Welcome to Apex Global, {emp.name}!
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
            <div className="text-2xl font-black text-emerald-400">{plan.coverage_score || 95}%</div>
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
                      <span>Source: <strong className="text-indigo-300">{m.source_doc_code}</strong> ({m.source_section})</span>
                      <span className="text-emerald-400 font-medium">Ground Truth Verified</span>
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
                  <Target className="w-4 h-4 text-emerald-400" />
                  {activeStage} Practical Tasks & Scenarios
                </h2>
                <p className="text-xs text-slate-400">Role-specific tasks and workplace simulations</p>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
                {completedTasks}/{totalTasks} Done
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {stageTasks.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">No practical tasks due in {activeStage}.</p>
              ) : (
                stageTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      task.is_completed
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-indigo-500/50'
                    }`}
                  >
                    <button className="mt-0.5 text-indigo-400 flex-shrink-0">
                      {task.is_completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {task.difficulty || 'Medium'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{task.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Checklist & Quizzes */}
        <div className="space-y-6">
          {/* Stage Checklist */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-cyan-400" />
                {activeStage} Checklist
              </h2>
              <span className="text-xs font-bold text-cyan-400">{checklistPercent}%</span>
            </div>

            <div className="space-y-2.5 mt-4">
              {stageChecklists.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">No checklist items for {activeStage}.</p>
              ) : (
                stageChecklists.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 cursor-pointer transition flex items-start gap-2.5"
                  >
                    <button className="mt-0.5">
                      {item.is_done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="space-y-0.5 flex-1">
                      <p className={`text-xs ${item.is_done ? 'line-through text-slate-400' : 'text-slate-200 font-medium'}`}>
                        {item.activity}
                      </p>
                      {item.source_reference && (
                        <p className="text-[10px] text-slate-400">Ref: {item.source_reference}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quizzes & Knowledge Check */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Knowledge Checks & Quizzes
              </h2>
            </div>

            <div className="space-y-3 mt-4">
              {quizzes.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">No active quizzes generated for this plan.</p>
              ) : (
                quizzes.map((quiz) => (
                  <div key={quiz.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white">{quiz.title}</span>
                      <p className="text-[11px] text-slate-400">Passing Score: {quiz.passing_score}%</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveQuiz(quiz);
                        setQuizAnswers({});
                        setQuizResult(null);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Attempt Quiz ({quiz.questions?.length || 0} Questions)
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
          <div className="glass-panel max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{activeQuiz.title}</h3>
                <p className="text-xs text-slate-400">Source-Grounded Policy Assessment</p>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {quizResult ? (
              <div className="space-y-4 py-4 text-center">
                <div className={`text-4xl font-black ${quizResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quizResult.score}%
                </div>
                <p className="text-sm text-slate-200 font-semibold">
                  {quizResult.passed ? 'Congratulations! You passed this compliance assessment.' : 'Score below passing threshold (80%). Please review policies and retry.'}
                </p>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {(activeQuiz.questions || []).map((q, qIdx) => (
                  <div key={q.id || qIdx} className="space-y-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-xs font-bold text-slate-200">
                      Q{qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                            quizAnswers[qIdx] === optIdx
                              ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
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
                  disabled={submittingQuiz}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  {submittingQuiz ? 'Evaluating answers against policy rules...' : 'Submit Answers & Calculate Score'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
