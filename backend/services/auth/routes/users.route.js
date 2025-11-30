// backend/services/auth/routes/users.route.js
const express = require('express');
const { asyncHandler } = require('../../../shared/http');
const { requireAuth, requireRole } = require('../../../shared/auth');

const { validate } = require('../validators');
const { updateRoleSchema } = require('../validators/user.schema');
const {
  listUsers,
  getUser,
  changeRole,
} = require('../controllers/users.controller');

const router = express.Router();

// Të gjitha rrugët këtu kërkojnë: admin i loguar
router.use(requireAuth, requireRole('admin'));

// GET /auth/users
router.get('/', asyncHandler(listUsers));

// GET /auth/users/:id
router.get('/:id', asyncHandler(getUser));

// PATCH /auth/users/:id/role
router.patch(
  '/:id/role',
  validate(updateRoleSchema),
  asyncHandler(changeRole)
);

module.exports = router;
