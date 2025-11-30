// backend/shared/auth.js
const jwt = require('jsonwebtoken');

/**
 * Gjeneron një access token për user-in
 * user: { id, email, role }
 */
function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' } // mund ta ndryshosh
  );
}

/**
 * Gjeneron një refresh token
 */
function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Middleware: kërkon Authorization: Bearer <token>
 * Nëse token-i është OK → vendos req.user
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      console.error('JWT verify error:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // payload: { sub, email, role, iat, exp }
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  });
}

/**
 * Middleware: lejon vetëm user-at me role të caktuara
 * p.sh. requireRole('admin'), requireRole('admin', 'professor')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  requireAuth,
  requireRole,
};
