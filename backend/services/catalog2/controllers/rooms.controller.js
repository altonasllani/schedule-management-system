const Rooms = require('../models/rooms.model');
const { validateRoom, validateRoomUpdate } = require('../validators/room.schema');

const roomsController = {
  // Merr të gjitha dhomat
  async getAllRooms(req, res) {
    try {
      const rooms = await Rooms.findAll();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Merr dhomë sipas ID
  async getRoomById(req, res) {
    try {
      const { id } = req.params;
      const room = await Rooms.findById(id);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Krijo dhomë të re
  async createRoom(req, res) {
    try {
      const { error } = validateRoom(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const room = await Rooms.create(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Përditëso dhomë ekzistuese
  async updateRoom(req, res) {
    try {
      const { id } = req.params;
      
      const { error } = validateRoomUpdate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const room = await Rooms.update(id, req.body);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Fshi dhomë
  async deleteRoom(req, res) {
    try {
      const { id } = req.params;
      const room = await Rooms.delete(id);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = roomsController;