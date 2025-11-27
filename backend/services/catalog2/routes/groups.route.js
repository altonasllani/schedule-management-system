const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups.controller');

// @route   GET /api/groups
// @desc    Merr të gjitha grupet
// @access  Public
router.get('/', groupsController.getAllGroups);

// @route   GET /api/groups/:id
// @desc    Merr grup sipas ID
// @access  Public
router.get('/:id', groupsController.getGroupById);

// @route   POST /api/groups
// @desc    Krijo grup të ri
// @access  Public
router.post('/', groupsController.createGroup);

// @route   PUT /api/groups/:id
// @desc    Përditëso grup ekzistues
// @access  Public
router.put('/:id', groupsController.updateGroup);

// @route   DELETE /api/groups/:id
// @desc    Fshi grup
// @access  Public
router.delete('/:id', groupsController.deleteGroup);

module.exports = router;