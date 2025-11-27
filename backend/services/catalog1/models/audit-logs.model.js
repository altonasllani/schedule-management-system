const pool = require('./index');

class AuditLog {
  static async findAll() {
    const result = await pool.query(`
      SELECT al.*, u.name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
    `);
    return result.rows;
  }

  static async create(auditLogData) {
    const { user_id, action, entity, entity_id, payload } = auditLogData;
    const result = await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, payload) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, action, entity, entity_id, payload]
    );
    return result.rows[0];
  }

  static async findByUser(user_id) {
    const result = await pool.query(
      'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  }

  static async findByEntity(entity, entity_id) {
    const result = await pool.query(
      'SELECT * FROM audit_logs WHERE entity = $1 AND entity_id = $2 ORDER BY created_at DESC',
      [entity, entity_id]
    );
    return result.rows;
  }
}

module.exports = AuditLog;