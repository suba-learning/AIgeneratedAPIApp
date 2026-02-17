const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

app.get('/simulate-error', (req, res, next) => {
  next(new Error('Simulated server error'));
});

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);

// fallback 404 for unknown api routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

module.exports = app;
