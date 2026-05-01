import { body } from 'express-validator';

export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 4, max: 12 }).withMessage('Password must be between 4 and 12 characters')
    .matches(/^[A-Z]/).withMessage('Password must start with a capital letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('role').optional().isIn(['MEMBER', 'ADMIN']).withMessage('Invalid role provided'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];
