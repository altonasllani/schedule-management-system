const pool = require('./index');

class Course {
  static async findAll() {
    const result = await pool.query('SELECT * FROM courses ORDER BY id');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(courseData) {
    const { name } = courseData;
    const result = await pool.query(
      'INSERT INTO courses (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  static async update(id, courseData) {
    const { name } = courseData;
    const result = await pool.query(
      'UPDATE courses SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM courses WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Course;