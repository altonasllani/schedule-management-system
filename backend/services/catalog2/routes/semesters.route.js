const express = require('express');
const router = express.Router();
const semestersController = require('../controllers/semesters.controller');

// @route   GET /api/semesters
// @desc    Merr të gjitha semestrat
// @access  Public
router.get('/', semestersController.getAllSemesters);

// @route   GET /api/semesters/current
// @desc    Merr semestrin aktual
// @access  Public
router.get('/current', semestersController.getCurrentSemester); // ✅ KORRIGJUAR: /current jo /current/current

// @route   GET /api/semesters/:id
// @desc    Merr semestër sipas ID
// @access  Public
router.get('/:id', semestersController.getSemesterById);

// @route   POST /api/semesters
// @desc    Krijo semestër të ri
// @access  Public
router.post('/', semestersController.createSemester);

// @route   PUT /api/semesters/:id
// @desc    Përditëso semestër ekzistues
// @access  Public
router.put('/:id', semestersController.updateSemester);

// @route   DELETE /api/semesters/:id
// @desc    Fshi semestër
// @access  Public
router.delete('/:id', semestersController.deleteSemester);

module.exports = router;