require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, onError } = require('../../shared/http');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'catalog1',
    time: new Date().toISOString(),
  });
});

// Routes
app.use('/api/courses', require('./routes/courses.route'));
app.use('/api/professors', require('./routes/professors.route'));
app.use('/api/group-courses', require('./routes/group-courses.route'));

// 404 + error handler
app.use(notFound);
app.use(onError);

// ✅ Ndrysho portin nga 3001 në 3002
const port = process.env.PORT_CATALOG1 || 3002;
app.listen(port, () => {
  console.log(`📚 Catalog1 service running on port ${port}`);
});