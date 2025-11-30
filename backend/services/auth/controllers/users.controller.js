// backend/services/auth/controllers/users.controller.js
const {
  findAllUsersWithRole,
  findUserById,
  updateUserRole,
} = require('../models/users.model');

/**
 * GET /auth/users
 * Vetëm admin
 */
async function listUsers(req, res) {
  const users = await findAllUsersWithRole();
  res.json({ users });
}

/**
 * GET /auth/users/:id
 * Vetëm admin
 */
async function getUser(req, res) {
  const id = Number(req.params.id);
  const user = await findUserById(id);

  if (!user) {
    return res.status(404).json({ error: 'User nuk u gjet' });
  }

  res.json({ user });
}

/**
 * PATCH /auth/users/:id/role
 * body: { role: 'admin' | 'professor' | 'student' }
 * Vetëm admin
 */
async function changeRole(req, res) {
  const id = Number(req.params.id);
  const { role } = req.body;

  const user = await findUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'User nuk u gjet' });
  }

  await updateUserRole(id, role);

  res.json({ message: 'Roli u përditësua me sukses' });
}

module.exports = {
  listUsers,
  getUser,
  changeRole,
};
