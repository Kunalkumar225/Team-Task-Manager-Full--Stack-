import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, CheckSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  task?: any | null;
  members: any[];
  allTasks: any[];
  userRole: string; // 'ADMIN' or 'MEMBER'
}

export const TaskModal = ({ isOpen, onClose, onSuccess, projectId, task, members, allTasks, userRole }: TaskModalProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssignedToId(task.assignedToId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
      setAssignedToId('');
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload: any = { status };
    if (userRole === 'ADMIN') {
      payload.title = title;
      payload.description = description;
      payload.priority = priority;
      payload.dueDate = dueDate || null;
      payload.assignedToId = assignedToId || null;
    }

    try {
      if (task) {
        await api.put(`/tasks/${task.id}`, payload);
        toast.success('Task updated successfully');
      } else {
        await api.post(`/tasks/project/${projectId}`, payload);
        toast.success('Task created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === 'ADMIN';
  const isAssignedToMe = task?.assignedToId === user?.id;
  const canEditState = isAdmin || isAssignedToMe;

  // Visual selector options
  const statusOptions = [
    { value: 'TODO', label: 'To Do', color: 'bg-slate-100 text-slate-700', active: 'bg-slate-700 text-white ring-2 ring-slate-200 shadow-md', dot: 'bg-slate-400' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-50 text-amber-700 border border-amber-100', active: 'bg-amber-500 text-white shadow-md ring-2 ring-amber-100 border-amber-500', dot: 'bg-amber-200' },
    { value: 'DONE', label: 'Done', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100', active: 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-100 border-emerald-500', dot: 'bg-emerald-200' },
    { value: 'OVERDUE', label: 'Overdue', color: 'bg-rose-50 text-rose-700 border border-rose-100', active: 'bg-rose-500 text-white shadow-md ring-2 ring-rose-100 border-rose-500', dot: 'bg-rose-200' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low', icon: '↓', color: 'text-emerald-600 bg-emerald-50 border border-emerald-100', active: 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-100' },
    { value: 'MEDIUM', label: 'Medium', icon: '→', color: 'text-amber-600 bg-amber-50 border border-amber-100', active: 'bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-100' },
    { value: 'HIGH', label: 'High', icon: '↑', color: 'text-rose-600 bg-rose-50 border border-rose-100', active: 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-100' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {!isAdmin && task && !canEditState && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-2 text-sm text-amber-800">
            <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p>You can only view this task. You must be an Admin or the Assignee to edit it.</p>
          </div>
        )}
        
        {!isAdmin && task && canEditState && (
          <div className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl mb-2 text-sm text-indigo-800">
            <ShieldAlert size={16} className="text-indigo-500 shrink-0 mt-0.5" />
            <p>As an assignee, you can only update the <strong>Status</strong> of this task.</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Name</label>
          <input
            type="text"
            required
            disabled={!isAdmin && !!task}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="input-field"
          />
        </div>
        
        {/* Description */}
        {(isAdmin || (!isAdmin && !task)) && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="input-field resize-none"
            ></textarea>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={!canEditState}
                onClick={() => setStatus(opt.value)}
                className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                  status === opt.value ? opt.active : opt.color
                } ${!canEditState ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${status === opt.value ? 'bg-white' : opt.dot}`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        {(isAdmin || (!isAdmin && !task)) && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    priority === opt.value ? opt.active : opt.color
                  } hover:-translate-y-0.5`}
                >
                  <span className="font-bold">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Due Date & Assignee */}
        {(isAdmin || (!isAdmin && !task)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assignee</label>
              <select
                value={assignedToId}
                onChange={(e) => setAssignedToId(e.target.value)}
                className="input-field"
              >
                <option value="">Unassigned</option>
                {members.map((m) => {
                  const activeCount = allTasks.filter(t => 
                    t.assignedToId === m.user.id && 
                    t.id !== task?.id && // Don't count the current task being edited
                    (t.status === 'TODO' || t.status === 'IN_PROGRESS')
                  ).length;
                  return (
                    <option key={m.user.id} value={m.user.id}>
                      {m.user.name} {activeCount === 0 ? '(Free)' : `(${activeCount} active tasks)`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Cancel
          </button>
          {(isAdmin || canEditState) && (
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="btn-primary px-6 py-2 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Task'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};
