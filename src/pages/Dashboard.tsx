import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { FolderKanban, CheckSquare, Clock, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Skeleton loader
const StatSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <div className="skeleton h-3 w-20 mb-4 rounded" />
    <div className="skeleton h-8 w-12 mb-2 rounded" />
    <div className="skeleton h-2 w-16 rounded" />
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className="skeleton h-8 w-64 mb-2 rounded" />
          <div className="skeleton h-4 w-48 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!data || data.totalProjects === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Welcome to TaskFlow"
        description={user?.role === 'ADMIN' ? "You don't have any projects yet. Create your first project to start managing tasks." : "You haven't been assigned to any projects yet. Wait for an admin to add you to a project."}
        action={
          <Link to="/projects" className="btn-primary px-5 py-2.5">
            Go to Projects
            <ArrowRight size={16} />
          </Link>
        }
      />
    );
  }

  const stats = [
    {
      label: 'Total Projects',
      value: data.totalProjects,
      icon: FolderKanban,
      gradient: 'from-indigo-500 to-violet-500',
      bg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      trend: '+2 this month',
    },
    {
      label: 'My Tasks',
      value: data.totalTasks,
      icon: CheckSquare,
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      trend: 'Total assigned',
    },
    {
      label: 'Completed',
      value: data.completedTasks,
      icon: Clock,
      gradient: 'from-emerald-400 to-teal-500',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: `${data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0}% done`,
    },
    {
      label: 'Overdue',
      value: data.overdueTasks,
      icon: AlertTriangle,
      gradient: 'from-rose-400 to-pink-500',
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      trend: 'Need attention',
    },
  ];

  const completionPct = data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0;

  const statusItems = [
    { label: 'To Do', value: data.tasksByStatus.TODO, color: 'bg-slate-400', text: 'text-slate-600', filter: 'TODO' },
    { label: 'In Progress', value: data.tasksByStatus.IN_PROGRESS, color: 'bg-amber-400', text: 'text-amber-700', filter: 'IN_PROGRESS' },
    { label: 'Done', value: data.tasksByStatus.DONE, color: 'bg-emerald-500', text: 'text-emerald-700', filter: 'DONE' },
    { label: 'Overdue', value: data.tasksByStatus.OVERDUE, color: 'bg-rose-500', text: 'text-rose-700', filter: 'OVERDUE' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
          {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Here's what's happening across your workspace today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-scale-in stagger-${i + 1}`}
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <TrendingUp size={11} />
              <span>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Task status breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Task Overview</h2>
            <p className="text-slate-400 text-xs mt-0.5">Overall completion across all projects</p>
          </div>
          <Link to="/tasks" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
              <span className="text-sm font-bold text-indigo-600">{completionPct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>

          {/* Status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statusItems.map((item, i) => (
              <Link
                key={i}
                to={`/tasks?filter=${item.filter}`}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-3 h-3 rounded-full ${item.color} mb-2`} />
                <p className={`text-2xl font-bold ${item.text}`}>{item.value}</p>
                <p className="text-xs font-medium text-slate-500 mt-1 text-center">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Team Workload Section (Admins Only) */}
      {user?.role === 'ADMIN' && data.teamWorkload && data.teamWorkload.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-base">Team Workload</h2>
            <p className="text-slate-400 text-xs mt-0.5">See who is free and who is currently busy with tasks</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.teamWorkload.map((member: any) => (
                <div 
                  key={member.user.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${member.activeTasks === 0 ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{member.user.name}</p>
                      <p className="text-xs text-slate-500">{member.user.email}</p>
                    </div>
                  </div>
                  <div className={`flex flex-col items-end`}>
                    <span className={`text-xl font-bold ${member.activeTasks === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {member.activeTasks}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${member.activeTasks === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {member.activeTasks === 0 ? 'Free' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
