const { pool } = require('../../../shared/db');

// Merr të gjithë profesorët
const getProfessors = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM professors';
    let params = [];

    if (search) {
      query += ' WHERE LOWER(name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1)';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching professors:', error);
    res.status(500).json({ error: 'Failed to fetch professors' });
  }
};

// Krijo profesor të ri
const createProfessor = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Professor name must be at least 2 characters' });
    }
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const result = await pool.query(
      'INSERT INTO professors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating professor:', error);
    res.status(500).json({ error: 'Failed to create professor' });
  }
};

module.exports = {
  getProfessors,
  createProfessor
};