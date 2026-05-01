import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import prisma from '../prisma.js';

export const requireGlobalAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  next();
};

export const requireProjectAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const projectId = req.params.id || req.params.projectId || req.body.projectId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!projectId) {
      res.status(400).json({ success: false, message: 'Project ID is required' });
      return;
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!member) {
      res.status(403).json({ success: false, message: 'Access denied: You are not a member of this project' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking roles' });
  }
};
