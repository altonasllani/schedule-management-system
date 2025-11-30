// backend/services/auth/routes/auth.route.js
const express = require('express');
const { asyncHandler } = require('../../../shared/http');
const { requireAuth } = require('../../../shared/auth');

const { validate } = require('../validators');
const { registerSchema } = require('../validators/user.schema');
const { loginSchema } = require('../validators/login.schema');

const {
  register,
  login,
  refresh,
  me,
} = require('../controllers/auth.controller');

const router = express.Router();

// POST /auth/register
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(register)
);

// POST /auth/login
router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(login)
);

// POST /auth/refresh
router.post(
  '/refresh',
  asyncHandler(refresh)
);

// GET /auth/me
router.get(
  '/me',
  requireAuth,
  asyncHandler(me)
);

module.exports = router;
