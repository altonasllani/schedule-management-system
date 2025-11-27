const pool = require('./index');

class Session {
  static async findAll() {
    const result = await pool.query(`
      SELECT s.*, 
             c.name as course_name,
             g.name as group_name,
             r.name as room_name,
             p.name as professor_name,
             sem.name as semester_name
      FROM sessions s
      LEFT JOIN courses c ON s.course_id = c.id
      LEFT JOIN groups g ON s.group_id = g.id
      LEFT JOIN rooms r ON s.room_id = r.id
      LEFT JOIN professors p ON s.professor_id = p.id
      LEFT JOIN semesters sem ON s.semester_id = sem.id
      ORDER BY s.id
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT s.*, 
              c.name as course_name,
              g.name as group_name,
              r.name as room_name,
              p.name as professor_name,
              sem.name as semester_name
       FROM sessions s
       LEFT JOIN courses c ON s.course_id = c.id
       LEFT JOIN groups g ON s.group_id = g.id
       LEFT JOIN rooms r ON s.room_id = r.id
       LEFT JOIN professors p ON s.professor_id = p.id
       LEFT JOIN semesters sem ON s.semester_id = sem.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async create(sessionData) {
    const { course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type } = sessionData;
    
    const result = await pool.query(
      `INSERT INTO sessions 
       (course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type || 'all']
    );
    
    return result.rows[0];
  }

  static async update(id, sessionData) {
    const { course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type } = sessionData;
    
    const result = await pool.query(
      `UPDATE sessions SET 
       course_id = $1, group_id = $2, room_id = $3, professor_id = $4, semester_id = $5, 
       day_of_week = $6, start_time = $7, end_time = $8, week_type = $9 
       WHERE id = $10 RETURNING *`,
      [course_id, group_id, room_id, professor_id, semester_id, day_of_week, start_time, end_time, week_type, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM sessions WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Session;