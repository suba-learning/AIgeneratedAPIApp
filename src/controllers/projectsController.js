const { db, createProject } = require('../models/db');

function validateProjectBody(body) {
  if (!body) return 'Missing body';
  if (!body.name) return 'Missing required field: name';
  if (!body.userId) return 'Missing required field: userId';
  return null;
}

exports.create = (req, res, next) => {
  try {
    const err = validateProjectBody(req.body);
    if (err) return res.status(400).json({ error: err });
    // verify user exists
    const user = db.users.find(u => u.id === req.body.userId);
    if (!user) return res.status(400).json({ error: 'User does not exist' });
    const project = createProject({ name: req.body.name, userId: req.body.userId });
    res.status(201).json(project);
  } catch (e) { next(e); }
};

exports.getAll = (req, res, next) => {
  try { res.json(db.projects); } catch (e) { next(e); }
};

exports.getById = (req, res, next) => {
  try {
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (e) { next(e); }
};

exports.update = (req, res, next) => {
  try {
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const err = validateProjectBody(req.body);
    if (err) return res.status(400).json({ error: err });
    // ensure user exists
    const user = db.users.find(u => u.id === req.body.userId);
    if (!user) return res.status(400).json({ error: 'User does not exist' });
    project.name = req.body.name;
    project.userId = req.body.userId;
    res.json(project);
  } catch (e) { next(e); }
};

exports.delete = (req, res, next) => {
  try {
    const idx = db.projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    const projectId = db.projects[idx].id;
    // delete its tasks
    for (let i = db.tasks.length - 1; i >= 0; i--) {
      if (db.tasks[i].projectId === projectId) db.tasks.splice(i, 1);
    }
    db.projects.splice(idx, 1);
    res.status(204).send();
  } catch (e) { next(e); }
};
