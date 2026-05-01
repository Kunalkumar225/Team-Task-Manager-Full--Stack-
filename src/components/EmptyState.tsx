import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-slate-200" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Layered rings */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
              <Icon className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>{title}</h3>
      {description && (
        <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
