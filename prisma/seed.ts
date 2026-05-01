import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      name: 'Team Member',
      email: 'member@taskflow.com',
      password: hashedPassword,
      role: 'MEMBER',
    },
  });

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Overhaul the corporate website with new branding.',
      createdById: adminUser.id,
      members: {
        create: [
          { userId: adminUser.id, role: 'ADMIN' },
          { userId: memberUser.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Launch',
      description: 'Prepare materials and engineering for the v1 mobile app release.',
      createdById: adminUser.id,
      members: {
        create: [
          { userId: adminUser.id, role: 'ADMIN' },
        ],
      },
    },
  });

  // Create tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design Mockups',
        description: 'Create Figma designs for the homepage.',
        status: 'DONE',
        priority: 'HIGH',
        projectId: project1.id,
        assignedToId: memberUser.id,
        createdById: adminUser.id,
      },
      {
        title: 'Determine Color Palette',
        description: 'Finalize the primary and secondary colors.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: project1.id,
        assignedToId: memberUser.id,
        createdById: adminUser.id,
      },
      {
        title: 'Setup Domain Name',
        status: 'TODO',
        priority: 'LOW',
        projectId: project1.id,
        assignedToId: adminUser.id,
        createdById: adminUser.id,
      },
      {
        title: 'App Store Submission',
        description: 'Submit the app to iOS and Google Play stores.',
        status: 'OVERDUE',
        priority: 'HIGH',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
        projectId: project2.id,
        assignedToId: adminUser.id,
        createdById: adminUser.id,
      },
      {
        title: 'Write Release Notes',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: project2.id,
        createdById: adminUser.id,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
