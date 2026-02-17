const { db, createTask } = require('../models/db');

function validateTaskBody(body) {
  if (!body) return 'Missing body';
  if (!body.title) return 'Missing required field: title';
  if (!body.projectId) return 'Missing required field: projectId';
  return null;
}

exports.create = (req, res, next) => {
  try {
    const err = validateTaskBody(req.body);
    if (err) return res.status(400).json({ error: err });
    // verify project exists
    const project = db.projects.find(p => p.id === req.body.projectId);
    if (!project) return res.status(400).json({ error: 'Project does not exist' });
    const task = createTask({ title: req.body.title, description: req.body.description || '', projectId: req.body.projectId, status: req.body.status });
    res.status(201).json(task);
  } catch (e) { next(e); }
};

exports.getAll = (req, res, next) => {
  try { res.json(db.tasks); } catch (e) { next(e); }
};

exports.getById = (req, res, next) => {
  try {
    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
};

exports.update = (req, res, next) => {
  try {
    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const err = validateTaskBody(req.body);
    if (err) return res.status(400).json({ error: err });
    // ensure project exists
    const project = db.projects.find(p => p.id === req.body.projectId);
    if (!project) return res.status(400).json({ error: 'Project does not exist' });
    task.title = req.body.title;
    task.description = req.body.description || '';
    task.projectId = req.body.projectId;
    task.status = req.body.status || task.status;
    res.json(task);
  } catch (e) { next(e); }
};

exports.delete = (req, res, next) => {
  try {
    const idx = db.tasks.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    db.tasks.splice(idx, 1);
    res.status(204).send();
  } catch (e) { next(e); }
};
