const { db, createUser } = require('../models/db');

function validateUserBody(body) {
  if (!body) return 'Missing body';
  if (!body.name) return 'Missing required field: name';
  if (!body.email) return 'Missing required field: email';
  return null;
}

exports.create = (req, res, next) => {
  try {
    const err = validateUserBody(req.body);
    if (err) return res.status(400).json({ error: err });
    // simple uniqueness on email
    if (db.users.find(u => u.email === req.body.email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const user = createUser({ name: req.body.name, email: req.body.email });
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

exports.getAll = (req, res, next) => {
  try {
    res.json(db.users);
  } catch (e) { next(e); }
};

exports.getById = (req, res, next) => {
  try {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) { next(e); }
};

exports.update = (req, res, next) => {
  try {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const err = validateUserBody(req.body);
    if (err) return res.status(400).json({ error: err });
    // check email conflict
    const other = db.users.find(u => u.email === req.body.email && u.id !== user.id);
    if (other) return res.status(409).json({ error: 'Email already in use' });
    user.name = req.body.name;
    user.email = req.body.email;
    res.json(user);
  } catch (e) { next(e); }
};

exports.delete = (req, res, next) => {
  try {
    const userIndex = db.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    const userId = db.users[userIndex].id;
    // business rule: prevent deleting user if they have projects
    const hasProjects = db.projects.some(p => p.userId === userId);
    if (hasProjects) return res.status(409).json({ error: 'Cannot delete user with existing projects' });
    db.users.splice(userIndex, 1);
    res.status(204).send();
  } catch (e) { next(e); }
};
