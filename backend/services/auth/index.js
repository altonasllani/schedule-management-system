// backend/services/auth/index.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { pool } = require('../../shared/db');
const { asyncHandler, notFound, onError } = require('../../shared/http');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Helper: krijo access + refresh tokens
function createTokens(user) {
  const accessPayload = {
    sub: user.id,
    role: user.role,
  };

  const refreshPayload = {
    sub: user.id,
  };

  const accessToken = jwt.sign(
    accessPayload,
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: Number(process.env.ACCESS_EXPIRES) || 1800, // sekonda
    }
  );

  const refreshToken = jwt.sign(
    refreshPayload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: Number(process.env.REFRESH_EXPIRES) || 1209600, // 14 ditë
    }
  );

  return { accessToken, refreshToken };
}

// Health check – për Auth service
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'auth',
    time: new Date().toISOString(),
  });
});

// POST /login – autentikim me email + password
app.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required' });
    }

    // Marrim user-in + rolin nga DB
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.password_hash,
        COALESCE(r.name, 'student') AS role
      FROM users u
      LEFT JOIN userroles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.email = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Kontrollojmë fjalëkalimin
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Gjenerojmë token-at
    const { accessToken, refreshToken } = createTokens({
      id: user.id,
      role: user.role,
    });

    // Kthejmë user info + tokens
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  })
);

// 404 + error handler
app.use(notFound);
app.use(onError);

// start server
const port = process.env.PORT_AUTH || 3001;
app.listen(port, () => {
  console.log(`🔐 Auth service listening on port ${port}`);
});
