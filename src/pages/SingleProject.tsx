import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Plus, Edit2, Trash2, ArrowLeft, Users, UserPlus, CheckSquare, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { RoleBadge, StatusBadge, PriorityBadge } from '../components/Badges';
import { ProjectModal } from '../components/ProjectModal';
import { TaskModal } from '../components/TaskModal';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';

const SingleProject = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'members'>('tasks');
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
    } catch {
      toast.error('Failed to fetch project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    setAddingMember(true);
    try {
      await api.post(`/projects/${id}/members`, { email: newMemberEmail });
      toast.success('Member added');
      setNewMemberEmail('');
      fetchProject();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove member from project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchProject();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchProject();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="skeleton h-10 w-80 rounded" />
        <div className="skeleton h-4 w-48 rounded" />
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="skeleton h-4 w-full rounded mb-3" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  const myRole = project.members.find((m: any) => m.userId === user?.id)?.role || 'MEMBER';
  const isAdmin = myRole === 'ADMIN';
  const doneTasks = project.tasks.filter((t: any) => t.status === 'DONE').length;
  const pct = project.tasks.length > 0 ? Math.round((doneTasks / project.tasks.length) * 100) : 0;

  const tabs = [
    { key: 'tasks', label: `Tasks (${project.tasks.length})`, icon: CheckSquare },
    { key: 'members', label: `Team (${project.members.length})`, icon: Users },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors w-fit"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
                  {project.name}
                </h1>
                <RoleBadge role={myRole} />
              </div>
              <p className="text-slate-500 text-sm max-w-2xl mb-4">
                {project.description || 'No description provided for this project.'}
              </p>
              {/* Progress */}
              <div className="max-w-sm">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>{doneTasks}/{project.tasks.length} tasks completed</span>
                  <span className="font-semibold text-slate-600">{pct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditProjectOpen(true)}
                  className="btn-secondary px-3 py-2 text-xs gap-1.5"
                  title="Edit Project"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pill tabs */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1.5 w-fit" style={{ boxShadow: 'var(--shadow-card)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          {isAdmin && (
            <div className="flex justify-end mb-4">
              <button
                id="add-task-btn"
                onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}
                className="btn-primary px-4 py-2 text-sm"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          )}

          {project.tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks yet"
              description={isAdmin ? 'Create tasks to get your team started.' : "This project doesn't have any tasks currently."}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-[38%]">Task Name</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                      <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Priority</th>
                      <th className="px-6 py-4 hidden sm:table-cell font-semibold uppercase tracking-wider text-xs">Assignee</th>
                      <th className="px-6 py-4 hidden sm:table-cell font-semibold uppercase tracking-wider text-xs">Due Date</th>
                      {isAdmin && <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider text-xs">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {project.tasks.map((task: any) => (
                      <tr
                        key={task.id}
                        onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                        className={`hover:bg-indigo-50/40 cursor-pointer transition-colors group ${
                          task.priority === 'HIGH' ? 'row-high' : task.priority === 'MEDIUM' ? 'row-medium' : 'row-low'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">{task.title}</div>
                          {task.description && (
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                          )}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                        <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          {task.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                {task.assignedTo.name.charAt(0)}
                              </div>
                              <span className="font-medium text-slate-700 text-sm">{task.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          {task.dueDate ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar size={13} className={task.status === 'OVERDUE' ? 'text-rose-500' : 'text-slate-400'} />
                              <span className={`text-sm ${task.status === 'OVERDUE' ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">No date</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => handleDeleteTask(task.id, e)}
                              className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete Task"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Users size={17} className="text-slate-400" />
                <h3 className="font-semibold text-slate-800">Team Roster</h3>
                <span className="ml-auto text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 font-medium">{project.members.length}</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {project.members.map((member: any) => (
                  <li key={member.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="avatar-ring shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{member.user.name}</div>
                        <div className="text-xs text-slate-400">{member.user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RoleBadge role={member.role} />
                      {isAdmin && member.userId !== user?.id && (
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <UserPlus size={16} className="text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Add Member</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Invite existing users to collaborate on this project.</p>
              <form onSubmit={handleAddMember} className="space-y-3">
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                  className="input-field"
                />
                <button
                  type="submit"
                  disabled={addingMember || !newMemberEmail}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  {addingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserPlus size={15} /> Invite Member</>}
                </button>
              </form>
              <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <div className="flex items-start gap-2">
                  <Shield size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-indigo-700">New members join as <strong>Member</strong> by default.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isAdmin && (
        <ProjectModal
          isOpen={isEditProjectOpen}
          onClose={() => setIsEditProjectOpen(false)}
          onSuccess={fetchProject}
          project={project}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSuccess={fetchProject}
          projectId={id!}
          task={selectedTask}
          members={project.members}
          allTasks={project.tasks}
          userRole={myRole}
        />
      )}
    </div>
  );
};

export default SingleProject;
