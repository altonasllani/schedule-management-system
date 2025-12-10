const model = require('../models/sessions.model');

exports.getAll = async (req, res) => {
  const sessions = await model.getAll();
  res.json(sessions);
};

exports.getById = async (req, res) => {
  const session = await model.getById(req.params.id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json(session);
};

exports.create = async (req, res) => {
  const result = await model.create(req.body);

  if (result?.conflict) {
    return res.status(400).json({
      error: "Konflikt orari: ekziston një sesion që përplaset në këtë orar."
    });
  }

  res.status(201).json(result);
};

exports.update = async (req, res) => {
  const result = await model.update(req.params.id, req.body);

  if (result?.conflict) {
    return res.status(400).json({
      error: "Konflikt orari: ekziston një sesion që përplaset në këtë orar."
    });
  }

  if (!result) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json(result);
};

exports.delete = async (req, res) => {
  const removed = await model.delete(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json({ message: "Session deleted successfully" });
};
