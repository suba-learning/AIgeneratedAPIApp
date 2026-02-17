# Mini Task Management API

Simple in-memory RESTful API for Users, Projects and Tasks built with Node.js and Express.

Requirements
- Node 18+ (or compatible)

Install

```bash
cd /path/to/TaskManagement
npm install
```

Run

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server listens on port 3000.

Endpoints
- Users: /api/users
- Projects: /api/projects
- Tasks: /api/tasks
- Simulate 500: /simulate-error

All endpoints accept and return JSON. IDs are UUIDs.

Business rules
- A project belongs to a user.
- A task belongs to a project.
- Prevent deleting a user if they have projects (409 Conflict).
- Deleting a project removes its tasks.
