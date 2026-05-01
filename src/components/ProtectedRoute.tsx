import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--color-surface-900)' }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 animate-glow-pulse"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 30px -8px rgba(99,102,241,0.7)' }}
        >
          <CheckSquare size={28} className="text-white" />
        </div>
        <p className="text-slate-400 text-sm font-medium mb-4" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
          TaskFlow
        </p>
        <Loader2 size={20} className="animate-spin text-indigo-400" />
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
