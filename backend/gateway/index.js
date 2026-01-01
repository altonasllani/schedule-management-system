require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { notFound, onError } = require('../shared/http');

const app = express();

// Middleware bazë
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ HEALTH CHECK PËR GATEWAY
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'gateway',
    time: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/health',
      catalog1: '/api/catalog1/health',
      catalog2: '/api/catalog2/health',
      schedule: '/api/schedule/health',
      gateway: '/api/gateway/health'
    }
  });
});

app.get('/api/gateway/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'gateway-direct',
    time: new Date().toISOString(),
  });
});

// ✅ PROXY PËR TË GJITHA SHËRBIMET:

// 1. AUTH SERVICE (3001)
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth'  // /api/auth/health -> http://localhost:3001/auth/health
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`🔐 [Gateway] Proxying to Auth: ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Auth proxy error:', err.message);
    res.status(502).json({
      error: 'Auth service unavailable',
      message: 'The authentication service is currently down'
    });
  }
}));

// 2. CATALOG1 SERVICE (3006)
app.use('/api/catalog1', createProxyMiddleware({
  target: 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/catalog1': '/api'  // /api/catalog1/courses -> http://localhost:3006/api/courses
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`📚 [Gateway] Proxying to Catalog1: ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Catalog1 proxy error:', err.message);
    res.status(502).json({
      error: 'Catalog1 service unavailable',
      message: 'The catalog1 service is currently down',
      direct_url: 'http://localhost:3006' + req.originalUrl.replace('/api/catalog1', '/api')
    });
  }
}));

// 3. CATALOG2 SERVICE (3007)
app.use('/api/catalog2', createProxyMiddleware({
  target: 'http://localhost:3007',
  changeOrigin: true,
  pathRewrite: {
    '^/api/catalog2': '/api'  // /api/catalog2/groups -> http://localhost:3007/api/groups
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`📚 [Gateway] Proxying to Catalog2: ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Catalog2 proxy error:', err.message);
    res.status(502).json({
      error: 'Catalog2 service unavailable',
      message: 'The catalog2 service is currently down',
      direct_url: 'http://localhost:3007' + req.originalUrl.replace('/api/catalog2', '/api')
    });
  }
}));

// 4. SCHEDULE SERVICE (3009)
app.use('/api/schedule', createProxyMiddleware({
  target: 'http://localhost:3009',
  changeOrigin: true,
  pathRewrite: {
    '^/api/schedule': ''  // /api/schedule/sessions -> http://localhost:3009/sessions
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`📅 [Gateway] Proxying to Schedule: ${req.originalUrl}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Schedule proxy error:', err.message);
    res.status(502).json({
      error: 'Schedule service unavailable',
      message: 'The schedule service is currently down',
      direct_url: 'http://localhost:3009' + req.originalUrl.replace('/api/schedule', '')
    });
  }
}));

// ✅ RUGËT INFORMATIVE PËR USER
app.get('/api/status', (req, res) => {
  res.json({
    message: '🚀 Gateway API - All services available through this gateway',
    services: [
      { name: 'Auth', port: 3001, path: '/api/auth', status: 'active' },
      { name: 'Catalog1', port: 3006, path: '/api/catalog1', status: 'active' },
      { name: 'Catalog2', port: 3007, path: '/api/catalog2', status: 'active' },
      { name: 'Schedule', port: 3009, path: '/api/schedule', status: 'active' },
      { name: 'Gateway', port: 3000, path: '/api/gateway', status: 'active' }
    ],
    documentation: 'All API requests should be prefixed with /api/{service-name}',
    example: 'GET /api/auth/health, POST /api/catalog1/courses'
  });
});

// ✅ FALLBACK ROUTE - Nëse shërbimi nuk është i disponueshëm
app.use('/api/*', (req, res) => {
  const service = req.originalUrl.split('/')[2]; // Merr emrin e shërbimit
  res.status(503).json({
    error: 'Service temporarily unavailable',
    requested_service: service,
    message: `The ${service} service is not responding through the gateway`,
    action: 'Check if the service is running and try again',
    timestamp: new Date().toISOString()
  });
});

// 404 + error handler
app.use(notFound);
app.use(onError);

// Start server
const port = process.env.PORT_GATEWAY || 3000;
app.listen(port, () => {
  console.log(`🚪 Gateway listening on port ${port}`);
  console.log(`🌐 Available endpoints:`);
  console.log(`   🔐 Auth:      http://localhost:${port}/api/auth/health`);
  console.log(`   📚 Catalog1:  http://localhost:${port}/api/catalog1/health`);
  console.log(`   📚 Catalog2:  http://localhost:${port}/api/catalog2/health`);
  console.log(`   📅 Schedule:  http://localhost:${port}/api/schedule/health`);
  console.log(`   🚪 Gateway:   http://localhost:${port}/api/health`);
  console.log(`   📊 Status:    http://localhost:${port}/api/status`);
});