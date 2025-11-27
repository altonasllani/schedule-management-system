const pool = require('./index');

class User {
  static async findAll() {
    const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, password_hash } = userData;
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password_hash]
    );
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email } = userData;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = User;