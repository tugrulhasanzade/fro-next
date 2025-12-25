
import React from 'react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  text: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const colors = {
    // Added shadow-[color] classes for the glow effect
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    warning: 'bg-amber-100 text-amber-900 border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30 dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    error: 'bg-red-100 text-red-900 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)] dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30 dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    info: 'bg-blue-100 text-blue-900 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30 dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200 shadow-[0_0_10px_rgba(148,163,184,0.3)] dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30 dark:shadow-[0_0_10px_rgba(148,163,184,0.1)]',
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md transition-all duration-300 hover:scale-105 ${colors[status]}`}>
      {text}
    </span>
  );
};
