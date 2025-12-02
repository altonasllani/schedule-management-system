const pool = require('./index');

const Rooms = {
  // Merr të gjitha dhomat
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM rooms ORDER BY id');
      return result.rows;
    } catch (error) {
      console.error('Error in Rooms.findAll:', error);
      throw error;
    }
  },

  // Merr dhomë sipas ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Rooms.findById:', error);
      throw error;
    }
  },

  // Krijo dhomë të re - KORRIGJUAR: vetëm 'name' dhe 'capacity'
  async create(roomData) {
    try {
      const { name, capacity } = roomData; // ✅ Vetëm këto ekzistojnë
      const result = await pool.query(
        'INSERT INTO rooms (name, capacity) VALUES ($1, $2) RETURNING *',
        [name, capacity]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Rooms.create:', error);
      throw error;
    }
  },

  // Përditëso dhomë ekzistuese - KORRIGJUAR
  async update(id, roomData) {
    try {
      const { name, capacity } = roomData; // ✅ Vetëm këto ekzistojnë
      const result = await pool.query(
        'UPDATE rooms SET name = $1, capacity = $2 WHERE id = $3 RETURNING *',
        [name, capacity, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Rooms.update:', error);
      throw error;
    }
  },

  // Fshi dhomë
  async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM rooms WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in Rooms.delete:', error);
      throw error;
    }
  }
};

module.exports = Rooms;