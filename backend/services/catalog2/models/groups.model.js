const pool = require('./index');

const Groups = {
  // Merr të gjitha grupet
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM groups ORDER BY id');
      return result.rows;
    } catch (error) {
      console.error('Error in Groups.findAll:', error);
      throw error;
    }
  },

  // Merr grup sipas ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Groups.findById:', error);
      throw error;
    }
  },

  // Krijo grup të ri - VETËM 'name' (struktura aktuale e databazës)
  async create(groupData) {
    try {
      const { name } = groupData; // ✅ Vetëm 'name' ekziston në skemën tuaj aktuale
      const result = await pool.query(
        'INSERT INTO groups (name) VALUES ($1) RETURNING *',
        [name]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Groups.create:', error);
      throw error;
    }
  },

  // Përditëso grup ekzistues - VETËM 'name'
  async update(id, groupData) {
    try {
      const { name } = groupData; // ✅ Vetëm 'name' ekziston
      const result = await pool.query(
        'UPDATE groups SET name = $1 WHERE id = $2 RETURNING *',
        [name, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Groups.update:', error);
      throw error;
    }
  },

  // Fshi grup
  async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM groups WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Groups.delete:', error);
      throw error;
    }
  }
};

module.exports = Groups;