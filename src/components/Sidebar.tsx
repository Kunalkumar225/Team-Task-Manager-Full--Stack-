import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/projects', label: 'Projects', icon: FolderKanban, end: false },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare, end: false },
    { to: '/profile', label: 'Profile', icon: User, end: false },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col shrink-0 z-20"
      style={{ width: 'var(--sidebar-width)', background: 'var(--sidebar-bg)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 animate-glow-pulse"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 14px -4px rgba(99,102,241,0.6)' }}
        >
          <CheckSquare size={19} className="text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight leading-none" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
            TaskFlow
          </span>
          <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase">Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Main menu</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative font-medium text-sm ${
                isActive
                  ? 'nav-active-pill text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/20'
                    : 'bg-transparent group-hover:bg-white/5'
                }`}>
                  <link.icon size={17} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                </div>
                <span>{link.label}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-indigo-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-white/5">
        {user && (
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="avatar-ring shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">
                {user.role === 'ADMIN' ? '⚡ Admin' : '👤 Member'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
