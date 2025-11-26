const { pool } = require('../../../shared/db');

const getGroupCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT gc.*, g.name as group_name, c.name as course_name
      FROM group_courses gc
      JOIN groups g ON gc.group_id = g.id
      JOIN courses c ON gc.course_id = c.id
      ORDER BY g.name, c.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group courses' });
  }
};

module.exports = {
  getGroupCourses
};