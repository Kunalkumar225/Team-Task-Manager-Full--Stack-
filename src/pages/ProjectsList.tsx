import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Loader2, Plus, FolderKanban, Users, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RoleBadge } from '../components/Badges';
import { EmptyState } from '../components/EmptyState';
import { ProjectModal } from '../components/ProjectModal';
import { useAuth } from '../context/AuthContext';

const PROJECT_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
];

const ProjectsList = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your team's ongoing initiatives.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button
            id="new-project-btn"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-4 py-2.5"
          >
            <Plus size={17} />
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="skeleton h-2 w-full rounded mb-4" style={{ height: 6 }} />
              <div className="skeleton h-5 w-40 rounded mb-2" />
              <div className="skeleton h-4 w-56 rounded mb-6" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="You aren't a member of any projects yet."
          action={
            user?.role === 'ADMIN' ? (
              <button onClick={() => setIsModalOpen(true)} className="btn-primary px-5 py-2.5">
                <Plus size={16} /> Create Project
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, idx) => {
            const role = project.members[0]?.role || 'MEMBER';
            const gradient = PROJECT_COLORS[idx % PROJECT_COLORS.length];
            const tasksDone = project.tasks?.filter((t: any) => t.status === 'DONE').length || 0;
            const totalTasks = project._count?.tasks || 0;
            const pct = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group animate-fade-scale-in stagger-${Math.min(idx + 1, 6)}`}
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                {/* Gradient accent top */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <FolderKanban size={18} className="text-white" />
                    </div>
                    <RoleBadge role={role} />
                  </div>

                  <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Progress */}
                  {totalTasks > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>{tasksDone}/{totalTasks} tasks done</span>
                        <span className="font-semibold text-slate-600">{pct}%</span>
                      </div>
                      <div className="progress-track">
                        <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Users size={13} />
                      <span>{project._count?.members || 0} member{project._count?.members !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500 text-xs font-semibold group-hover:gap-2 transition-all">
                      <span>Open</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
};

export default ProjectsList;
