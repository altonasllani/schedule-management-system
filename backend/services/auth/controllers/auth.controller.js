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
 * Ruajtja në PostgreSQL (trigger do të vendosë rolin 'student' automatikisht)
 */
async function register(req, res) {
  const { name, email, password } = req.body;

  // 1. Kontrollo nëse ekziston
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'This email is already registered' });
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Krijo user-in në PostgreSQL
  const user = await createUser({ name, email, passwordHash });

  // 4. Merr rolin nga PostgreSQL (trigger do të ketë vendosur 'student')
  const role = await findUserRoleByUserId(user.id) || 'student';

  // 5. Krijo token
  const userPayload = {
    id: user.id,
    email: user.email,
    role,
  };

  const accessToken = signAccessToken(userPayload);
  const refreshToken = signRefreshToken(userPayload);

  // 6. Kthe përgjigje
  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      created_at: user.created_at,
    },
    accessToken,
    refreshToken,
    message: 'Registration successful! User has been saved to PostgreSQL database.',
  });
}

/**
 * POST /auth/login
 * body: { email, password }
 * Verifikimi nga PostgreSQL
 */
async function login(req, res) {
  const { email, password } = req.body;

  // 1. Gjej user nga PostgreSQL
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // 2. Kontrollo password (bcrypt compare)
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // 3. Merr rolin nga PostgreSQL
  const role = await findUserRoleByUserId(user.id) || 'student';

  // 4. Krijo token
  const userPayload = {
    id: user.id,
    email: user.email,
    role,
  };

  const accessToken = signAccessToken(userPayload);
  const refreshToken = signRefreshToken(userPayload);

  // 5. Kthe përgjigje
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role,
      created_at: user.created_at,
    },
    accessToken,
    refreshToken,
    message: 'Login successful! User authenticated from PostgreSQL database.',
  });
}

/**
 * POST /auth/refresh
 * body: { refreshToken }
 */
async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Missing refreshToken' });
  }

  // Verifikimi i refresh token dhe krijimi i access token të ri
  const jwt = require('jsonwebtoken');
  
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, payload) => {
      if (err) {
        console.error('Refresh token error:', err.message);
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Verifikojmë që user-i ende ekziston
      const user = await findUserByEmail(payload.email);
      if (!user) {
        return res.status(401).json({ error: 'User no longer exists' });
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
        message: 'Access token refreshed successfully',
      });
    }
  );
}

/**
 * GET /auth/me
 * Kërkon requireAuth
 */
async function me(req, res) {
  return res.json({ 
    user: req.user,
    message: 'User data retrieved from PostgreSQL'
  });
}

module.exports = {
  register,
  login,
  refresh,
  me,
};
