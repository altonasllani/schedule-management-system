const pool = require('./index');

class GroupCourse {
  static async findAll() {
    const result = await pool.query(`
      SELECT gc.*, c.name as course_name, g.name as group_name
      FROM group_courses gc
      LEFT JOIN courses c ON gc.course_id = c.id
      LEFT JOIN groups g ON gc.group_id = g.id
      ORDER BY gc.group_id
    `);
    return result.rows;
  }

  static async create(groupCourseData) {
    const { group_id, course_id } = groupCourseData;
    const result = await pool.query(
      'INSERT INTO group_courses (group_id, course_id) VALUES ($1, $2) RETURNING *',
      [group_id, course_id]
    );
    return result.rows[0];
  }

  static async delete(group_id, course_id) {
    const result = await pool.query(
      'DELETE FROM group_courses WHERE group_id = $1 AND course_id = $2 RETURNING *',
      [group_id, course_id]
    );
    return result.rows[0];
  }
}

module.exports = GroupCourse;