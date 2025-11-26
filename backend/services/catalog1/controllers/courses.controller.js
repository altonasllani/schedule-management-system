const { pool } = require('../../../shared/db');

// Merr të gjitha kurset
const getCourses = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM courses';
    let params = [];

    if (search) {
      query += ' WHERE LOWER(name) LIKE LOWER($1)';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Merr një kurs sipas ID
const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// Krijo kurs të ri
const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Course name must be at least 2 characters' });
    }

    const result = await pool.query(
      'INSERT INTO courses (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse
};