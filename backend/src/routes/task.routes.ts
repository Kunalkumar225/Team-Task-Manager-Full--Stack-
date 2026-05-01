import { Router } from 'express';
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks
} from '../controllers/task.controller.js';
import { createTaskValidator, updateTaskValidator } from '../validators/task.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireProjectAdmin } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/my-tasks', getMyTasks as any);
router.get('/project/:projectId', getTasksByProject as any);
// Uses requireProjectAdmin middleware to check admin role on projectId param
router.post('/project/:projectId', requireProjectAdmin, createTaskValidator, validateRequest, createTask as any);

router.put('/:id', updateTaskValidator, validateRequest, updateTask as any);
// Uses requireProjectAdmin inside the controller instead of middleware because task ID is in URL, not projectId
router.delete('/:id', deleteTask as any);

export default router;
