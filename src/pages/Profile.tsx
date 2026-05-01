import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, LogOut, Shield, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const infoFields = [
    {
      icon: User,
      label: 'Full Name',
      value: user.name,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: user.email,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: Shield,
      label: 'Access Level',
      value: user.role === 'ADMIN' ? 'Administrator — Full Access' : 'Team Member',
      color: user.role === 'ADMIN' ? 'text-amber-600' : 'text-slate-600',
      bg: user.role === 'ADMIN' ? 'bg-amber-50' : 'bg-slate-50',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>Your Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        {/* Gradient cover */}
        <div className="h-36 mesh-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1">
              <Sparkles size={12} className="text-white" />
              <span className="text-white text-xs font-semibold">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar + info */}
          <div className="flex flex-col items-center -mt-16 mb-8 relative z-10">
            <div className="avatar-ring shadow-lg rounded-full mb-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-sm"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                {initials}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>{user.name}</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">{user.email}</p>
            </div>
          </div>

          {/* Info fields */}
          <div className="space-y-3">
            {infoFields.map((field, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100">
                <div className={`w-10 h-10 rounded-xl ${field.bg} flex items-center justify-center shrink-0`}>
                  <field.icon size={18} className={field.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-0.5">{field.label}</p>
                  <p className="font-semibold text-slate-800 text-sm truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className="mt-6 p-4 rounded-xl border border-rose-200 bg-rose-50">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-2">Danger Zone</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-rose-800">Sign out of your account</p>
                <p className="text-xs text-rose-600 mt-0.5">You'll need to sign back in to access TaskFlow.</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
