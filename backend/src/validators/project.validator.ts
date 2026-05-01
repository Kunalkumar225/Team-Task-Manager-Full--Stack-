import { body } from 'express-validator';

export const projectValidator = [
  body('name').notEmpty().withMessage('Project name is required').trim(),
  body('description').optional().trim(),
];

export const addMemberValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];
