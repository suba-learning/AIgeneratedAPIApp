const { v4: uuidv4 } = require('uuid');

// In-memory storage
const db = {
  users: [], // { id, name, email }
  projects: [], // { id, name, userId }
  tasks: [] // { id, title, description, projectId, status }
};

// Helper create functions that attach uuid if missing
function createUser({ name, email }) {
  const user = { id: uuidv4(), name, email };
  db.users.push(user);
  return user;
}

function createProject({ name, userId }) {
  const project = { id: uuidv4(), name, userId };
  db.projects.push(project);
  return project;
}

function createTask({ title, description, projectId, status = 'todo' }) {
  const task = { id: uuidv4(), title, description, projectId, status };
  db.tasks.push(task);
  return task;
}

module.exports = { db, createUser, createProject, createTask };
