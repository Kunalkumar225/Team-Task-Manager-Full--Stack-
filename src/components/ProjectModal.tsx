import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2, FolderKanban } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project?: { id: string; name: string; description: string } | null;
}

export const ProjectModal = ({ isOpen, onClose, onSuccess, project }: ProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        await api.put(`/projects/${project.id}`, { name, description });
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', { name, description });
        toast.success('Project created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'New Project'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {!project && (
          <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <FolderKanban size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-900">Create a new project</p>
              <p className="text-xs text-indigo-600 mt-0.5">You'll be set as project Admin.</p>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-700">Project Name</label>
            <span className="text-xs text-slate-400">{name.length}/60</span>
          </div>
          <input
            type="text"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Redesign Q4"
            className="input-field"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-700">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <span className="text-xs text-slate-400">{description.length}/300</span>
          </div>
          <textarea
            rows={3}
            maxLength={300}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this project about?"
            className="input-field resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading || !name.trim()} className="btn-primary px-5 py-2 text-sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (project ? 'Save Changes' : 'Create Project')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
