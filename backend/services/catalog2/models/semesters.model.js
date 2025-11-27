const pool = require('./index');

const Semesters = {
  // Merr të gjitha semestrat
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM semesters ORDER BY id');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching semesters: ${error.message}`);
    }
  },

  // Merr semestër sipas ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM semesters WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching semester with ID ${id}: ${error.message}`);
    }
  },

  // Krijo semestër të ri
  async create(semesterData) {
    try {
      const { name, start_date, end_date, is_active } = semesterData;
      const result = await pool.query(
        'INSERT INTO semesters (name, start_date, end_date, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, start_date, end_date, is_active || true]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating semester: ${error.message}`);
    }
  },

  // Përditëso semestër ekzistues
  async update(id, semesterData) {
    try {
      const { name, start_date, end_date, is_active } = semesterData;
      const result = await pool.query(
        'UPDATE semesters SET name = $1, start_date = $2, end_date = $3, is_active = $4 WHERE id = $5 RETURNING *',
        [name, start_date, end_date, is_active, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating semester with ID ${id}: ${error.message}`);
    }
  },

  // Fshi semestër
  async delete(id) {
    try {
      const result = await pool.query('DELETE FROM semesters WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting semester with ID ${id}: ${error.message}`);
    }
  }
};

module.exports = Semesters;