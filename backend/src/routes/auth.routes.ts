import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register as any);
router.post('/login', loginValidator, validateRequest, login as any);
router.get('/me', authenticate, getMe as any);

export default router;
