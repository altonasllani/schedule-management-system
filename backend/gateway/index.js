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

// ✅ RRUGËT PËR CATALOG1 - Përditëso portin nga 3001 në 3002
app.get('/api/catalog1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'catalog1-through-gateway',
    time: new Date().toISOString(),
  });
});

app.get('/api/catalog1/courses', (req, res) => {
  res.json({
    message: 'Courses API - Shko direkt në http://localhost:3002/api/courses',
    direct_url: 'http://localhost:3002/api/courses'
  });
});

app.post('/api/catalog1/courses', (req, res) => {
  res.json({
    message: 'Create course - Shko direkt në http://localhost:3002/api/courses',
    direct_url: 'http://localhost:3002/api/courses'
  });
});

app.get('/api/catalog1/courses/:id', (req, res) => {
  res.json({
    message: `Get course ${req.params.id} - Shko direkt në http://localhost:3002/api/courses/${req.params.id}`,
    direct_url: `http://localhost:3002/api/courses/${req.params.id}`
  });
});

app.get('/api/catalog1/professors', (req, res) => {
  res.json({
    message: 'Professors API - Shko direkt në http://localhost:3002/api/professors',
    direct_url: 'http://localhost:3002/api/professors'
  });
});

app.post('/api/catalog1/professors', (req, res) => {
  res.json({
    message: 'Create professor - Shko direkt në http://localhost:3002/api/professors',
    direct_url: 'http://localhost:3002/api/professors'
  });
});

app.get('/api/catalog1/group-courses', (req, res) => {
  res.json({
    message: 'Group Courses API - Shko direkt në http://localhost:3002/api/group-courses',
    direct_url: 'http://localhost:3002/api/group-courses'
  });
});

// këtu më vonë do shtojmë rruget për auth, catalog2, schedule
const { createProxyMiddleware } = require('http-proxy-middleware');

// SCHEDULE
app.use('/api/schedule', createProxyMiddleware({
  target: 'http://localhost:3009',
  changeOrigin: true,
  pathRewrite: { '^/api/schedule': '' },
}));

// 404 + error handler
app.use(notFound);
app.use(onError);

// start server
const port = process.env.PORT_GATEWAY || 3000;
app.listen(port, () => {
  console.log(`🚪 Gateway listening on port ${port}`);
});