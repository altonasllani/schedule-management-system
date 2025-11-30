// backend/services/auth/index.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { notFound, onError } = require('../../shared/http');
const authRoutes = require('./routes/auth.route');
const usersRoutes = require('./routes/users.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/auth/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'auth',
    time: new Date().toISOString(),
  });
});

// Rrugët kryesore
app.use('/auth', authRoutes);
app.use('/auth/users', usersRoutes);

// 404 + error handler
app.use(notFound);
app.use(onError);

const port = process.env.PORT_AUTH || 3001;
app.listen(port, () => {
  console.log(`🔐 Auth service listening on port ${port}`);
});
