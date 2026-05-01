import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Loader2, CheckSquare, Calendar, AlertCircle } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import { formatDate } from '../utils/helpers';
import { EmptyState } from '../components/EmptyState';
import { Link, useSearchParams } from 'react-router-dom';
import { TaskModal } from '../components/TaskModal';

type FilterType = 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE';

const FILTERS: { key: FilterType; label: string; color: string }[] = [
  { key: 'ALL',         label: 'All',         color: 'text-slate-600' },
  { key: 'TODO',        label: 'To Do',       color: 'text-slate-600' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'text-amber-600' },
  { key: 'DONE',        label: 'Done',        color: 'text-emerald-600' },
  { key: 'OVERDUE',     label: 'Overdue',     color: 'text-rose-600' },
];

const MyTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') as FilterType;
  const [filter, setFilterState] = useState<FilterType>(
    FILTERS.some(f => f.key === filterParam) ? filterParam : 'ALL'
  );

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    if (filterParam && FILTERS.some(f => f.key === filterParam)) {
      setFilterState(filterParam);
    }
  }, [filterParam]);

  const setFilter = (newFilter: FilterType) => {
    setFilterState(newFilter);
    setSearchParams({ filter: newFilter });
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/my-tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch my tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);
  const counts: Record<string, number> = {};
  FILTERS.forEach((f) => {
    counts[f.key] = f.key === 'ALL' ? tasks.length : tasks.filter((t) => t.status === f.key).length;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>My Tasks</h1>
        <p className="text-slate-500 text-sm mt-1">All tasks assigned to you across every project.</p>
      </div>

      {/* Summary stats */}
      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FILTERS.slice(1).map((f) => (
            <div
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                filter === f.key ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100' : 'border-slate-200'
              }`}
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <p className="text-2xl font-bold text-slate-900">{counts[f.key]}</p>
              <p className={`text-xs font-semibold mt-1 ${f.color}`}>{f.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {!loading && tasks.length > 0 && (
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1.5 w-fit flex-wrap" style={{ boxShadow: 'var(--shadow-card)' }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 ${filter === f.key ? 'text-indigo-200' : 'text-slate-400'}`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="All caught up!"
          description="You don't have any tasks assigned to you right now."
        />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-slate-400 text-sm">No tasks match this filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-[32%] font-semibold uppercase tracking-wider text-xs">Task Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Project</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Priority</th>
                  <th className="px-6 py-4 hidden sm:table-cell font-semibold uppercase tracking-wider text-xs">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((task) => (
                  <tr
                    key={task.id}
                    onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                    className={`hover:bg-indigo-50/40 cursor-pointer transition-colors group ${
                      task.priority === 'HIGH' ? 'row-high' : task.priority === 'MEDIUM' ? 'row-medium' : 'row-low'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">{task.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/projects/${task.projectId}`}
                        className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium text-xs bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {task.project?.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                    <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {task.dueDate ? (
                        <div className={`flex items-center gap-1.5 ${task.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-500'}`}>
                          {task.status === 'OVERDUE' ? <AlertCircle size={13} /> : <Calendar size={13} />}
                          <span className={`text-xs ${task.status === 'OVERDUE' ? 'font-semibold' : ''}`}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">No date</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isTaskModalOpen && selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSuccess={fetchTasks}
          projectId={selectedTask.projectId}
          task={selectedTask}
          members={[]}
          allTasks={[]}
          userRole="MEMBER"
        />
      )}
    </div>
  );
};

export default MyTasks;
