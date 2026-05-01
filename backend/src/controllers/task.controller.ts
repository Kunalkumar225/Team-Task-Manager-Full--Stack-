import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../prisma.js';

export const getTasksByProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    
    // Verify membership
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: req.user!.id } }
    });

    if (!member) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: tasks, message: 'Tasks fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching tasks' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId,
        createdById: req.user!.id
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } }
      }
    });

    res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } = req.body;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({ where: { id }, include: { project: true } });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId } }
    });

    if (!member) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    // Role-based logic: Member can only update status if assigned. Admin can update everything.
    let updateData: any = {};
    if (member.role === 'ADMIN') {
      updateData = { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : null, assignedToId };
    } else {
      if (task.assignedToId !== userId) {
        res.status(403).json({ success: false, message: 'Members can only update their assigned tasks' });
        return;
      }
      // members can only update status
      if (status) updateData.status = status;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } }
      }
    });

    res.json({ success: true, data: updatedTask, message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin of the project this task belongs to
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: req.user!.id } }
    });

    if (!member || member.role !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Only admins can delete tasks' });
      return;
    }

    await prisma.task.delete({ where: { id } });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: req.user!.id },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json({ success: true, data: tasks, message: 'Your tasks fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching your tasks' });
  }
};
