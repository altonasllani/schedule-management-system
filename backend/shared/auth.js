const jwt = require('jsonwebtoken');

// Middleware: kërkon token të vlefshëm
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // ruajmë user-in në req për përdorim më vonë
    req.user = {
      id: payload.sub,
      role: payload.role || 'student',
    };

    next();
  } catch (err) {
    console.error('❌ JWT error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware: kontrollon rolin (admin, user, student, …)
function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // nëse nuk kemi lista rolesh, lejojmë të gjithë user-at e loguar
    if (roles.length === 0) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
