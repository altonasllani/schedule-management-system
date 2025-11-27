require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Database connection - KORRIGJUAR
const pool = require('./models');

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const groupsRoutes = require('./routes/groups.route');
const roomsRoutes = require('./routes/rooms.route');
const semestersRoutes = require('./routes/semesters.route');

// Routes
app.use('/api/groups', groupsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/semesters', semestersRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'catalog2',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '📚 Catalog2 Service - Resource Management',
    version: '1.0.0',
    endpoints: {
      groups: '/api/groups',
      rooms: '/api/rooms',
      semesters: '/api/semesters',
      health: '/api/health'
    }
  });
});

// 404 Handler për routes që nuk ekzistojnë
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Server configuration
const PORT = process.env.PORT_CATALOG2 || 3007;
const HOST = process.env.HOST || 'localhost';

// Start server
app.listen(PORT, () => {
  console.log(`📚 Catalog2 Service is running`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: http://${HOST}:${PORT}`);
  console.log(`🔍 Health check: http://${HOST}:${PORT}/api/health`);
  console.log('⏰ Started at:', new Date().toISOString());
  console.log('──────────────────────────────────────────');
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;