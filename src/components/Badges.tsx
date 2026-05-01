import React from 'react';

export const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === 'ADMIN';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
      isAdmin
        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
        : 'bg-slate-100 text-slate-600 border border-slate-200'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-indigo-500' : 'bg-slate-400'}`} />
      {isAdmin ? '⚡ Admin' : 'Member'}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { dot: string; bg: string; text: string; border: string; label: string }> = {
    TODO:        { dot: 'bg-slate-400',   bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200',   label: 'To Do' },
    IN_PROGRESS: { dot: 'bg-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'In Progress' },
    DONE:        { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Done' },
    OVERDUE:     { dot: 'bg-rose-500',    bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    label: 'Overdue' },
  };
  const c = config[status] || config.TODO;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: string }) => {
  const config: Record<string, { arrow: string; bg: string; text: string; border: string }> = {
    LOW:    { arrow: '↓', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    MEDIUM: { arrow: '→', bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
    HIGH:   { arrow: '↑', bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  };
  const c = config[priority] || config.MEDIUM;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap border ${c.bg} ${c.text} ${c.border}`}>
      <span className="font-bold">{c.arrow}</span>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
};
