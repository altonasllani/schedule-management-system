const pool = require('./index');

const Groups = {
  // Merr të gjitha grupet
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM groups ORDER BY id');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching groups: ${error.message}`);
    }
  },

  // Merr grup sipas ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching group with ID ${id}: ${error.message}`);
    }
  },

  // Krijo grup të ri
  async create(groupData) {
    try {
      const { name, description, semester_id } = groupData;
      const result = await pool.query(
        'INSERT INTO groups (name, description, semester_id) VALUES ($1, $2, $3) RETURNING *',
        [name, description, semester_id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating group: ${error.message}`);
    }
  },

  // Përditëso grup ekzistues
  async update(id, groupData) {
    try {
      const { name, description, semester_id } = groupData;
      const result = await pool.query(
        'UPDATE groups SET name = $1, description = $2, semester_id = $3 WHERE id = $4 RETURNING *',
        [name, description, semester_id, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating group with ID ${id}: ${error.message}`);
    }
  },

  // Fshi grup
  async delete(id) {
    try {
      const result = await pool.query('DELETE FROM groups WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting group with ID ${id}: ${error.message}`);
    }
  }
};

module.exports = Groups;