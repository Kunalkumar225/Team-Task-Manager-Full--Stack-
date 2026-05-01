import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import prisma from '../prisma.js';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId: req.user!.id }
        }
      },
      include: {
        _count: {
          select: { members: true, tasks: true }
        },
        members: {
          where: { userId: req.user!.id },
          select: { role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: projects, message: 'Projects fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: userId,
        members: {
          create: {
            userId: userId,
            role: 'ADMIN' // Creator is automatically ADMIN
          }
        }
      }
    });
    res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating project' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Must be a member to view
    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId } }
    });

    if (!member) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true } },
            createdBy: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json({ success: true, data: project, message: 'Project fetched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: { name, description }
    });

    res.json({ success: true, data: project, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting project' });
  }
};

export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      res.status(404).json({ success: false, message: 'User not found with this email' });
      return;
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId: userToAdd.id } }
    });

    if (existingMember) {
      res.status(400).json({ success: false, message: 'User is already a member of this project' });
      return;
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: userToAdd.id,
        role: 'MEMBER'
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json({ success: true, data: newMember, message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error adding member' });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id, userId } = req.params;
    
    if (userId === req.user!.id) {
      res.status(400).json({ success: false, message: 'You cannot remove yourself' });
      return;
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId: id, userId } }
    });

    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error removing member' });
  }
};
