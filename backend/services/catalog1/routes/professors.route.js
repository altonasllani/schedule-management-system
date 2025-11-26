const express = require('express');
const router = express.Router();
const {
  getProfessors,
  createProfessor
} = require('../controllers/professors.controller');

router.get('/', getProfessors);
router.post('/', createProfessor);

module.exports = router;