require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, onError } = require('../../shared/http');
const { Pool } = require('pg');

const app = express();

// Database connection
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DB || 'sms',
  port: process.env.PG_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('📌 PostgreSQL connected successfully');
    release();
  }
});

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

// ✅ ROUTET E REJA - Shtoni këto direkt në index.js
// GET /api/groups
app.get('/api/groups', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM groups ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
             c.name as course_name,
             g.name as group_name,
             r.name as room_name,
             p.name as professor_name,
             sem.name as semester_name
      FROM sessions s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN rooms r ON s.room_id = r.id
      LEFT JOIN professors p ON s.professor_id = p.id
      LEFT JOIN semesters sem ON s.semester_id = sem.id
      ORDER BY s.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/semesters
app.get('/api/semesters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM semesters ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/roles
app.get('/api/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/userroles
app.get('/api/userroles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ur.*, u.name as user_name, r.name as role_name
      FROM userroles ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY ur.user_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 + error handler
app.use(notFound);
app.use(onError);

// ✅ Ndrysho portin nga 3001 në 3002
const port = process.env.PORT_CATALOG1 || 3002;
app.listen(port, () => {
  console.log(`📚 Catalog1 service running on port ${port}`);
});