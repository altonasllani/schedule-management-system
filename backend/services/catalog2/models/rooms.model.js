const pool = require('./index');

const Rooms = {
  // Merr të gjitha dhomat
  async findAll() {
    try {
      const result = await pool.query('SELECT * FROM rooms ORDER BY id');
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching rooms: ${error.message}`);
    }
  },

  // Merr dhomë sipas ID
  async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching room with ID ${id}: ${error.message}`);
    }
  },

  // Krijo dhomë të re
  async create(roomData) {
    try {
      const { name, capacity, location, equipment } = roomData;
      const result = await pool.query(
        'INSERT INTO rooms (name, capacity, location, equipment) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, capacity, location, equipment]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  },

  // Përditëso dhomë ekzistuese
  async update(id, roomData) {
    try {
      const { name, capacity, location, equipment } = roomData;
      const result = await pool.query(
        'UPDATE rooms SET name = $1, capacity = $2, location = $3, equipment = $4 WHERE id = $5 RETURNING *',
        [name, capacity, location, equipment, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating room with ID ${id}: ${error.message}`);
    }
  },

  // Fshi dhomë
  async delete(id) {
    try {
      const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting room with ID ${id}: ${error.message}`);
    }
  }
};

module.exports = Rooms;