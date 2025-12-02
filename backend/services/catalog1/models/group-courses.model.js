const pool = require('./index');

class Group {
  static async findAll() {
    const result = await pool.query(`
      SELECT g.*, s.name as semester_name
      FROM groups g
      LEFT JOIN semesters s ON g.semester_id = s.id
      ORDER BY g.name
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(`
      SELECT g.*, s.name as semester_name
      FROM groups g
      LEFT JOIN semesters s ON g.semester_id = s.id
      WHERE g.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(groupData) {
    const { name, description, semester_id } = groupData;
    const result = await pool.query(
      `INSERT INTO groups (name, description, semester_id) 
       VALUES ($1, $2, $3) RETURNING *`,
      [name, description || null, semester_id || null]
    );
    return result.rows[0];
  }

  static async update(id, groupData) {
    const { name, description, semester_id } = groupData;
    const result = await pool.query(
      `UPDATE groups 
       SET name = $1, description = $2, semester_id = $3 
       WHERE id = $4 RETURNING *`,
      [name, description || null, semester_id || null, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM groups WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Group;