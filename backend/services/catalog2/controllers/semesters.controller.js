const Semesters = require('../models/semesters.model');
const { validateSemester, validateSemesterUpdate } = require('../validators/semester.schema');

const semestersController = {
  // Merr të gjitha semestrat
  async getAllSemesters(req, res) {
    try {
      const semesters = await Semesters.findAll();
      res.json(semesters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Merr semestër sipas ID
  async getSemesterById(req, res) {
    try {
      const { id } = req.params;
      const semester = await Semesters.findById(id);
      
      if (!semester) {
        return res.status(404).json({ error: 'Semester not found' });
      }
      
      res.json(semester);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Krijo semestër të ri
  async createSemester(req, res) {
    try {
      const { error } = validateSemester(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const semester = await Semesters.create(req.body);
      res.status(201).json(semester);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Përditëso semestër ekzistues
  async updateSemester(req, res) {
    try {
      const { id } = req.params;
      
      const { error } = validateSemesterUpdate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const semester = await Semesters.update(id, req.body);
      
      if (!semester) {
        return res.status(404).json({ error: 'Semester not found' });
      }
      
      res.json(semester);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Fshi semestër
  async deleteSemester(req, res) {
    try {
      const { id } = req.params;
      const semester = await Semesters.delete(id);
      
      if (!semester) {
        return res.status(404).json({ error: 'Semester not found' });
      }
      
      res.json({ message: 'Semester deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = semestersController;