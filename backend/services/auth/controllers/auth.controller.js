// backend/services/auth/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const {
  createUser,
  findUserByEmail,
  findUserRoleByUserId,
} = require('../models/users.model');

const {
  signAccessToken,
  signRefreshToken,
} = require('../../../shared/auth');

/**
 * POST /auth/register
 * body: { name, email, password }
 */
async function register(req, res) {
  const { name, email, password } = req.body;

  // kontrollo nëse ekziston
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Ky email është i regjistruar tashmë' });
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // krijo user-in
  const user = await createUser({ name, email, passwordHash });

  // Trigger-i në DB i jep rolin 'student'
  const role = await findUserRoleByUserId(user.id) || 'student';

  const userPayload = {
    id: user.id,
    email: user.email,
    role,
  };

  const accessToken = signAccessToken(userPayload);
  const refreshToken = signRefreshToken(userPayload);

  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
    accessToken,
    refreshToken,
  });
}

/**
 * POST /auth/login
 * body: { email, password }
 */
async function login(req, res) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Email ose password i pasaktë' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Email ose password i pasaktë' });
  }

  const role = await findUserRoleByUserId(user.id) || 'student';

  const userPayload = {
    id: user.id,
    email: user.email,
    role,
  };

  const accessToken = signAccessToken(userPayload);
  const refreshToken = signRefreshToken(userPayload);

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    },
    accessToken,
    refreshToken,
  });
}

/**
 * POST /auth/refresh
 * body: { refreshToken }
 * (opsionale, por shumë e dobishme)
 */
const jwt = require('jsonwebtoken');

async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing refreshToken' });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, payload) => {
      if (err) {
        console.error('Refresh token error:', err.message);
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // verifikojmë që user-i ende ekziston dhe roli i tij aktual
      const user = await findUserByEmail(payload.email);
      if (!user) {
        return res.status(401).json({ error: 'User nuk ekziston më' });
      }

      const role = await findUserRoleByUserId(user.id) || payload.role;

      const userPayload = {
        id: user.id,
        email: user.email,
        role,
      };

      const newAccessToken = signAccessToken(userPayload);

      return res.json({
        accessToken: newAccessToken,
      });
    }
  );
}

/**
 * GET /auth/me
 * kërkon requireAuth; përdor req.user
 */
async function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  refresh,
  me,
};
