import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from '../controllers/project.controller.js';
import { projectValidator, addMemberValidator } from '../validators/project.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireProjectAdmin, requireGlobalAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getProjects as any);
router.post('/', requireGlobalAdmin, projectValidator, validateRequest, createProject as any);
router.get('/:id', getProjectById as any);
router.put('/:id', requireProjectAdmin, projectValidator, validateRequest, updateProject as any);
router.delete('/:id', requireProjectAdmin, deleteProject as any);

router.post('/:id/members', requireProjectAdmin, addMemberValidator, validateRequest, addMember as any);
router.delete('/:id/members/:userId', requireProjectAdmin, removeMember as any);

export default router;
