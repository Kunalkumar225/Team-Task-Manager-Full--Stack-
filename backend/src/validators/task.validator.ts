import { body } from 'express-validator';

export const createTaskValidator = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').optional().trim(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('dueDate').optional().isISO8601().withMessage('Valid ISO8601 date is required'),
  body('assignedToId').optional().isString(),
];

export const updateTaskValidator = [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('dueDate').optional().isISO8601(),
  body('assignedToId').optional({ nullable: true }).isString(),
];
