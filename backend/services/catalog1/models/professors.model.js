const pool = require('./index');

class Professor {
  static async findAll() {
    const result = await pool.query('SELECT * FROM professors ORDER BY id');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM professors WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(professorData) {
    const { name, email } = professorData;
    const result = await pool.query(
      'INSERT INTO professors (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  }

  static async update(id, professorData) {
    const { name, email } = professorData;
    const result = await pool.query(
      'UPDATE professors SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM professors WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Professor;