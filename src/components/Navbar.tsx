import React from 'react';
import { Bell, LogOut, ChevronRight, LayoutDashboard, FolderKanban, CheckSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const routeMeta: Record<string, { label: string; Icon: any }> = {
  '':         { label: 'Dashboard', Icon: LayoutDashboard },
  'projects': { label: 'Projects',  Icon: FolderKanban },
  'tasks':    { label: 'My Tasks',  Icon: CheckSquare },
  'profile':  { label: 'Profile',   Icon: User },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const segment = location.pathname.split('/')[1] || '';
  const meta = routeMeta[segment] || { label: 'Dashboard', Icon: LayoutDashboard };
  const { Icon, label } = meta;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="h-16 glass border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-widest">TaskFlow</span>
          <ChevronRight size={13} />
        </div>
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
            <Icon size={13} className="text-indigo-600" />
          </div>
          <span className="font-semibold text-sm">{label}</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          id="navbar-notifications"
          className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          title="Notifications"
        >
          <Bell size={19} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"
            style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
          />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User avatar pill */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer group">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.role}</p>
            </div>
          </div>
        )}

        <button
          id="navbar-logout"
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Sign out"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
