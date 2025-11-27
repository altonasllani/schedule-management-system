require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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

// ✅ ROUTET PËR CATALOG1 - ENTITETET KRYESORE

// ==================== COURSES - CRUD COMPLETE ====================
app.get('/api/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (name.length > 100) {
      return res.status(400).json({ error: 'Name must be less than 100 characters' });
    }
    
    const result = await pool.query(
      'INSERT INTO courses (name) VALUES ($1) RETURNING *', 
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (name.length > 100) {
      return res.status(400).json({ error: 'Name must be less than 100 characters' });
    }
    
    const result = await pool.query(
      'UPDATE courses SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM courses WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROFESSORS - CRUD COMPLETE ====================
app.get('/api/professors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professors ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/professors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM professors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/professors', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const result = await pool.query(
      'INSERT INTO professors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/professors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const result = await pool.query(
      'UPDATE professors SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/professors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM professors WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    
    res.json({ message: 'Professor deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SESSIONS - CRUD COMPLETE ====================
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

app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
      WHERE s.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const { course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type } = req.body;
    
    if (!course_id || !group_id || !room_id || !professor_id || !semester_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (day_of_week < 1 || day_of_week > 7) {
      return res.status(400).json({ error: 'Day of week must be between 1 and 7' });
    }
    if (start_time >= end_time) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }
    if (course_id <= 0 || group_id <= 0 || room_id <= 0 || professor_id <= 0 || semester_id <= 0) {
      return res.status(400).json({ error: 'All IDs must be positive numbers' });
    }
    
    const result = await pool.query(
      `INSERT INTO sessions 
       (course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type || 'all']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type } = req.body;
    
    if (!course_id || !group_id || !room_id || !professor_id || !semester_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (day_of_week < 1 || day_of_week > 7) {
      return res.status(400).json({ error: 'Day of week must be between 1 and 7' });
    }
    if (start_time >= end_time) {
      return res.status(400).json({ error: 'Start time must be before end time' });
    }
    if (course_id <= 0 || group_id <= 0 || room_id <= 0 || professor_id <= 0 || semester_id <= 0) {
      return res.status(400).json({ error: 'All IDs must be positive numbers' });
    }
    
    const result = await pool.query(
      `UPDATE sessions SET 
       course_id = $1, group_id = $2, room_id = $3, professor_id = $4, semester_id = $5, 
       day_of_week = $6, start_time = $7, end_time = $8, week_type = $9 
       WHERE id = $10 RETURNING *`,
      [course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM sessions WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USERS - CRUD COMPLETE ====================
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password_hash } = req.body;
    if (!name || !email || !password_hash) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password_hash.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROLES - CRUD COMPLETE ====================
app.get('/api/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    const result = await pool.query(
      'INSERT INTO roles (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // ✅ VALIDIMI I RI
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    const result = await pool.query(
      'UPDATE roles SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM roles WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json({ message: 'Role deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GROUP-COURSES - CRUD COMPLETE ====================
app.get('/api/group-courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT gc.*, c.name as course_name, g.name as group_name
      FROM group_courses gc
      LEFT JOIN courses c ON gc.course_id = c.id
      LEFT JOIN groups g ON gc.group_id = g.id
      ORDER BY gc.group_id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/group-courses', async (req, res) => {
  try {
    const { group_id, course_id } = req.body;
    if (!group_id || !course_id) {
      return res.status(400).json({ error: 'Group ID and Course ID are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (group_id <= 0 || course_id <= 0) {
      return res.status(400).json({ error: 'IDs must be positive numbers' });
    }
    
    const result = await pool.query(
      'INSERT INTO group_courses (group_id, course_id) VALUES ($1, $2) RETURNING *',
      [group_id, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/group-courses/:group_id/:course_id', async (req, res) => {
  try {
    const { group_id, course_id } = req.params;
    const result = await pool.query(
      'DELETE FROM group_courses WHERE group_id = $1 AND course_id = $2 RETURNING *',
      [group_id, course_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group-Course relationship not found' });
    }
    
    res.json({ message: 'Group-Course relationship deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROLES MANAGEMENT ====================
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

app.post('/api/userroles', async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    if (!user_id || !role_id) {
      return res.status(400).json({ error: 'User ID and Role ID are required' });
    }
    
    // ✅ VALIDIMI I RI
    if (user_id <= 0 || role_id <= 0) {
      return res.status(400).json({ error: 'IDs must be positive numbers' });
    }
    
    const result = await pool.query(
      'INSERT INTO userroles (user_id, role_id) VALUES ($1, $2) RETURNING *',
      [user_id, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/userroles/:user_id/:role_id', async (req, res) => {
  try {
    const { user_id, role_id } = req.params;
    const result = await pool.query(
      'DELETE FROM userroles WHERE user_id = $1 AND role_id = $2 RETURNING *',
      [user_id, role_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User-Role relationship not found' });
    }
    
    res.json({ message: 'User-Role relationship deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handlers
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT_CATALOG1 || 3006;
app.listen(port, () => {
  console.log(`📚 Catalog1 service running on port ${port}`);
  console.log(`✅ All CRUD operations available WITH VALIDATION:`);
  console.log(`   📖 Courses: GET, POST, PUT, DELETE`);
  console.log(`   👨‍🏫 Professors: GET, POST, PUT, DELETE`);
  console.log(`   🕐 Sessions: GET, POST, PUT, DELETE`);
  console.log(`   👥 Users: GET, POST, PUT, DELETE`);
  console.log(`   🔑 Roles: GET, POST, PUT, DELETE`);
  console.log(`   📚 Group-Courses: GET, POST, DELETE`);
  console.log(`   👥🔑 User-Roles: GET, POST, DELETE`);
});