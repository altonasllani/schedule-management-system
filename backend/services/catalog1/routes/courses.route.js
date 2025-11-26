const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse
} = require('../controllers/courses.controller');

router.get('/', getCourses);
router.post('/', createCourse);
router.get('/:id', getCourse);

module.exports = router;