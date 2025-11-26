const express = require('express');
const router = express.Router();
const {
  getGroupCourses
} = require('../controllers/group-courses.controller');

router.get('/', getGroupCourses);

module.exports = router;