// backend/gateway/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, onError } = require('../shared/http');

const app = express();

// Middleware bazë
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check – për me testu që gateway po punon
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'gateway',
    time: new Date().toISOString(),
  });
});

// këtu më vonë do shtojmë rruget për auth, catalog1, catalog2, schedule

// 404 + error handler
app.use(notFound);
app.use(onError);

// start server
const port = process.env.PORT_GATEWAY || 3000;
app.listen(port, () => {
  console.log(`🚪 Gateway listening on port ${port}`);
});
