const Groups = require('../models/groups.model');
const { validateGroup, validateGroupUpdate } = require('../validators/group.schema');

const groupsController = {
  // Merr të gjitha grupet
  async getAllGroups(req, res) {
    try {
      const groups = await Groups.findAll();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Merr grup sipas ID
  async getGroupById(req, res) {
    try {
      const { id } = req.params;
      const group = await Groups.findById(id);
      
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Krijo grup të ri
  async createGroup(req, res) {
    try {
      const { error } = validateGroup(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const group = await Groups.create(req.body);
      res.status(201).json(group);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Përditëso grup ekzistues
  async updateGroup(req, res) {
    try {
      const { id } = req.params;
      
      const { error } = validateGroupUpdate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const group = await Groups.update(id, req.body);
      
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      
      res.json(group);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Fshi grup
  async deleteGroup(req, res) {
    try {
      const { id } = req.params;
      const group = await Groups.delete(id);
      
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      
      res.json({ message: 'Group deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = groupsController;