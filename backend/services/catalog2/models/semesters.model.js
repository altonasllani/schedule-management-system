const pool = require('./index');

const Semesters = {
  // Merr të gjitha semestrat
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM semesters ORDER BY start_date DESC');
      return result.rows;
    } catch (error) {
      console.error('Error in Semesters.findAll:', error);
      throw error;
    }
  },

  // Merr semestër sipas ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM semesters WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Semesters.findById:', error);
      throw error;
    }
  },

  // Krijo semestër të ri
  async create(semesterData) {
    try {
      const { name, start_date, end_date } = semesterData;
      const result = await pool.query(
        'INSERT INTO semesters (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
        [name, start_date, end_date]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Semesters.create:', error);
      throw error;
    }
  },

  // Përditëso semestër ekzistues
  async update(id, semesterData) {
    try {
      const { name, start_date, end_date } = semesterData;
      const result = await pool.query(
        'UPDATE semesters SET name = $1, start_date = $2, end_date = $3 WHERE id = $4 RETURNING *',
        [name, start_date, end_date, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Semesters.update:', error);
      throw error;
    }
  },

  // Fshi semestër
  async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM semesters WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Semesters.delete:', error);
      throw error;
    }
  },

  // ✅ Metodë për semestrin aktual - KORRIGJUAR
  async findCurrent() {
    try {
      const result = await pool.query(`
        SELECT * FROM semesters 
        WHERE start_date <= CURRENT_DATE 
        AND end_date >= CURRENT_DATE 
        ORDER BY start_date DESC 
        LIMIT 1
      `);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Semesters.findCurrent:', error);
      throw error;
    }
  }
};

module.exports = Semesters;