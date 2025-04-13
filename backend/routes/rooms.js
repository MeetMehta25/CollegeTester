const express = require('express');
const router = express.Router();
const { getRooms, addRoom, deleteRoom } = require('../controllers/roomController');

// GET all rooms
router.get('/', getRooms);
router.post('/', addRoom);
router.delete('/:roomnumber', deleteRoom);

module.exports = router;
