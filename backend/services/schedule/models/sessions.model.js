const { pool } = require('../../shared/db');

class SessionModel {
  async getAll() {
    const query = `SELECT * FROM sessions ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
  }

  async getById(id) {
    const query = `SELECT * FROM sessions WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const conflict = await this.hasConflict(data);
    if (conflict) return { conflict: true };

    const query = `
      INSERT INTO sessions (group_id, room_id, subject, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const params = [
      data.group_id,
      data.room_id,
      data.subject,
      data.start_time,
      data.end_time,
    ];

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  async update(id, data) {
    const conflict = await this.hasConflict(data);
    if (conflict) return { conflict: true };

    const query = `
      UPDATE sessions
      SET group_id=$1, room_id=$2, subject=$3, start_time=$4, end_time=$5
      WHERE id=$6
      RETURNING *;
    `;

    const params = [
      data.group_id,
      data.room_id,
      data.subject,
      data.start_time,
      data.end_time,
      id,
    ];

    const result = await pool.query(query, params);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = `DELETE FROM sessions WHERE id=$1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /** Kontrolli i përplasjes së orareve */
  async hasConflict({ group_id, room_id, start_time, end_time }) {
    const query = `
      SELECT * FROM sessions
      WHERE 
        (group_id = $1 OR room_id = $2)
        AND ($3, $4) OVERLAPS (start_time, end_time)
    `;

    const result = await pool.query(query, [
      group_id,
      room_id,
      start_time,
      end_time,
    ]);

    return result.rows.length > 0;
  }
}

module.exports = new SessionModel();
