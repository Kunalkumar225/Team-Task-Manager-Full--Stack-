import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../prisma.js';

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const totalProjects = await prisma.projectMember.count({
      where: { userId }
    });

    const tasksAssigned = await prisma.task.findMany({
      where: { assignedToId: userId }
    });

    const totalTasks = tasksAssigned.length;
    const completedTasks = tasksAssigned.filter(t => t.status === 'DONE').length;
    
    const now = new Date();
    const overdueTasks = tasksAssigned.filter(t => 
      t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < now
    ).length;

    // Grouping by status
    const tasksByStatus = {
      TODO: tasksAssigned.filter(t => t.status === 'TODO').length,
      IN_PROGRESS: tasksAssigned.filter(t => t.status === 'IN_PROGRESS').length,
      DONE: completedTasks,
      OVERDUE: overdueTasks
    };

    let teamWorkload: any[] = [];
    if (req.user!.role === 'ADMIN') {
      const adminProjects = await prisma.projectMember.findMany({
        where: { userId, role: 'ADMIN' },
        select: { projectId: true }
      });
      const projectIds = adminProjects.map(p => p.projectId);

      const activeTasks = await prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
          status: { in: ['TODO', 'IN_PROGRESS'] },
          assignedToId: { not: null }
        },
      });

      const allMembers = await prisma.projectMember.findMany({
        where: { projectId: { in: projectIds } },
        include: { user: { select: { id: true, name: true, email: true } } }
      });

      const workloadMap = new Map();
      for (const m of allMembers) {
        if (!workloadMap.has(m.user.id)) {
          workloadMap.set(m.user.id, { user: m.user, activeTasks: 0 });
        }
      }

      for (const t of activeTasks) {
        if (t.assignedToId && workloadMap.has(t.assignedToId)) {
          workloadMap.get(t.assignedToId).activeTasks += 1;
        }
      }

      teamWorkload = Array.from(workloadMap.values()).sort((a, b) => a.activeTasks - b.activeTasks);
    }

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        tasksByStatus,
        teamWorkload
      },
      message: 'Dashboard summary fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching dashboard summary' });
  }
};
