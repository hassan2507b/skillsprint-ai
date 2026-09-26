import React from 'react';

export const StatusBadge = ({ status }) => {
  const norm = String(status || '').toLowerCase().replace(/_/g, ' ');

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (norm.includes('verified') && !norm.includes('warning') && !norm.includes('partially')) {
    colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    dotColor = 'bg-emerald-400';
  } else if (norm.includes('warning') || norm.includes('partially') || norm.includes('attention')) {
    colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-800/80';
    dotColor = 'bg-amber-400 animate-pulse';
  } else if (norm.includes('flagged') || norm.includes('rejected') || norm.includes('quarantined') || norm.includes('unsupported') || norm.includes('contradict')) {
    colorClasses = 'bg-rose-950/80 text-rose-300 border-rose-800/80';
    dotColor = 'bg-rose-400';
  } else if (norm.includes('approved') || norm.includes('completed') || norm.includes('active')) {
    colorClasses = 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';
    dotColor = 'bg-cyan-400';
  } else if (norm.includes('pending') || norm.includes('in progress')) {
    colorClasses = 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80';
    dotColor = 'bg-indigo-400 animate-pulse';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span className="capitalize">{norm || 'Unknown'}</span>
    </span>
  );
};
