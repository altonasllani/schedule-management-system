const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/rooms.controller');

// @route   GET /api/rooms
// @desc    Merr të gjitha dhomat
// @access  Public
router.get('/', roomsController.getAllRooms);

// @route   GET /api/rooms/:id
// @desc    Merr dhomë sipas ID
// @access  Public
router.get('/:id', roomsController.getRoomById);

// @route   POST /api/rooms
// @desc    Krijo dhomë të re
// @access  Public
router.post('/', roomsController.createRoom);

// @route   PUT /api/rooms/:id
// @desc    Përditëso dhomë ekzistuese
// @access  Public
router.put('/:id', roomsController.updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Fshi dhomë
// @access  Public
router.delete('/:id', roomsController.deleteRoom);

module.exports = router;