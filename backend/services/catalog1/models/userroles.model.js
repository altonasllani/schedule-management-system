const pool = require('./index');

class UserRole {
  static async findAll() {
    const result = await pool.query(`
      SELECT ur.*, u.name as user_name, r.name as role_name
      FROM userroles ur
      LEFT JOIN users u ON ur.user_id = u.id
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY ur.user_id
    `);
    return result.rows;
  }

  static async create(userRoleData) {
    const { user_id, role_id } = userRoleData;
    const result = await pool.query(
      'INSERT INTO userroles (user_id, role_id) VALUES ($1, $2) RETURNING *',
      [user_id, role_id]
    );
    return result.rows[0];
  }

  static async delete(user_id, role_id) {
    const result = await pool.query(
      'DELETE FROM userroles WHERE user_id = $1 AND role_id = $2 RETURNING *',
      [user_id, role_id]
    );
    return result.rows[0];
  }
}

module.exports = UserRole;