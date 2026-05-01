# TaskFlow - Team Task Manager

TaskFlow is a complete, production-ready full-stack web application designed for teams to manage tasks, collaborate on projects, and track progress effectively. It uses a modern tech stack centered around Express, PostgreSQL, Prisma, and React.

## Features
- **Authentication**: Secure sign up and login using JWT and bcryptjs.
- **Projects**: Create projects, add/remove members, and track related resources.
- **Tasks**: Create, update, assign, and delete tasks. Support for statuses (TODO, IN_PROGRESS, DONE, OVERDUE) and priorities (LOW, MEDIUM, HIGH).
- **Role-Based Access Control (RBAC)**: Admin vs Member roles. Admins have full access to projects; members can update their own tasks.
- **Dashboard**: Real-time analytical overview, displaying project metrics and task statistics.
- **Responsive UI**: Fully designed component system using Tailwind CSS & Lucide Icons.

## Tech Stack
### Backend
- Node.js & Express.js
- PostgreSQL & Prisma
- JSON Web Tokens (JWT) & bcryptjs
- express-validator

### Frontend
- React.js & Vite
- React Router DOM
- Axios (Interceptor config for auth)
- Tailwind CSS & Lucide React
- Context API for global auth state management

## Local Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Rename `.env.example` to `.env` and provide your PostgreSQL connection string.
   ```bash
   cp .env.example .env
   ```

3. **Initialize Database**
   Run Prisma migrations to set up the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   # Alternatively, create a formal migration:
   # npx prisma migrate dev --name init
   ```

4. **Seed the Database**
   This creates demo users (Admin & Member), projects, and tasks for testing:
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   Start the Express + Vite server concurrently:
   ```bash
   npm run dev
   ```

Note: The development server automatically serves the API on `/api` and the React frontend on `http://localhost:3000`.

## Seed Users (Demo Data)
- **Admin**: `admin@taskflow.com` / `password123`
- **Member**: `member@taskflow.com` / `password123`

## Environment Variables (.env)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Required) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Token validity duration (e.g., `7d`) |
| `PORT` | The port your server runs on (defaults to 3000) |
| `APP_URL` | Application root URL |
| `FRONTEND_URL` | Specifically defined in environments that separate frontend origin |

## API Route Documentation

| Method | Endpoint | Description | Protected? |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get logged-in user profile | Yes |
| GET | `/api/projects` | Get all projects user belongs to | Yes |
| POST | `/api/projects` | Create a new project (Auto-Admin) | Yes |
| GET | `/api/projects/:id` | Get details, members & tasks | Yes |
| PUT | `/api/projects/:id` | Update project details | Admin |
| DELETE| `/api/projects/:id` | Delete project | Admin |
| POST | `/api/projects/:id/members` | Add a member by email | Admin |
| DELETE| `/api/projects/:id/members/:userId`| Remove a member | Admin |
| GET | `/api/tasks/project/:projectId`| Get tasks by project | Yes |
| POST | `/api/tasks/project/:projectId`| Create a task | Admin |
| PUT | `/api/tasks/:id` | Update task (Assignee or Admin) | Yes |
| DELETE| `/api/tasks/:id` | Delete task | Admin |
| GET | `/api/tasks/my-tasks` | Get current user assigned tasks | Yes |
| GET | `/api/dashboard` | Dashboard global metrics summary | Yes |

## Railway Deployment
1. Connect your repository to Railway.
2. Provision a PostgreSQL Database add-on in Railway.
3. Railway automatically injects `DATABASE_URL`. Ensure you set `JWT_SECRET` and `PORT`.
4. Update package.json scripts for Railway build & start (already set):
   `npm run build` will compile the frontend.
   `npm start` (if added) should be `node server.ts` running over `tsx`.
   *(Consider configuring `tsx` globally or building server.ts to a raw js file for high-scale prod environments).*
