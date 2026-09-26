import React, { useEffect, useState } from 'react';
import { promptService } from '../services/api';
import { FileCode2, Sparkles, Layers, Shield } from 'lucide-react';

export const PromptTemplates = () => {
  const [prompts, setPrompts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const res = await promptService.getPrompts();
        setPrompts(res.data);
      } catch (err) {
        console.error('Failed to load prompts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-indigo-400 font-medium text-xs animate-pulse">
          Loading versioned prompt registries...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-indigo-900/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <FileCode2 className="w-5 h-5 text-indigo-400" />
              Controlled Prompt Registry & Versioning
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Version-controlled system & user prompt templates with strict data-instruction separation
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
            Active Version: v{prompts?.active_version || '2.4.0'}
          </span>
        </div>
      </div>

      {/* System Prompt */}
      <div className="glass-panel p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-2">
            <Shield className="w-4 h-4" /> System Prompt (Data-Instruction Sandboxing)
          </h2>
          <span className="text-[10px] text-slate-400">Strict JSON Output Enforced</span>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {prompts?.system_prompt}
        </pre>
      </div>

      {/* User Prompt */}
      <div className="glass-panel p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-xs font-bold uppercase text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> User Prompt Template
          </h2>
          <span className="text-[10px] text-slate-400">Ground-Truth Matrix Injected</span>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {prompts?.user_prompt}
        </pre>
      </div>
    </div>
  );
};
